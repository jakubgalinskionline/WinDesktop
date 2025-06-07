import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  Type
} from '@angular/core';
import { Subscription } from 'rxjs';

import { WindowModel } from '../../models/window/window.model';
import { WindowClasses } from '../../models/window/windowClasses.model';
import { WindowStyles } from '../../models/window/windowStyles.model';
import { WindowService } from '../../services/window.service';
import { ThemeService } from '../../services/theme.service';
import { DragDropData } from '../../models/window/drag-drop.model';

interface DynamicComponent {
  [key: string]: any;
}

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
  standalone: true,
  imports: [CommonModule],
  host: {
    '[class.window-container]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() window!: WindowModel;
  @Input() isDarkMode: boolean = false;
  @Input() isDraggable?: boolean = false;
  @ViewChild('componentcontainer', { read: ViewContainerRef, static: true }) componentContainer!: ViewContainerRef;

  public isDragging = false;
  public isResizing = false;
  private resizeDirection = '';
  private minWidth = 200;
  private minHeight = 150;
  private dragOffset = { x: 0, y: 0 };
  private screenBounds = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  private readonly TASKBAR_HEIGHT = 40;
  private subscriptions = new Subscription();
  private lastMoveTime = 0;
  private readonly THROTTLE_TIME = 16; // około 60 FPS
  private componentRef?: ComponentRef<any>;

  constructor(
    private windowService: WindowService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  ngOnInit() {
    // Przekaż kontekst okna
    (window as any).currentWindowComponent = this;

    // Subskrybuj tryb ciemny
    this.subscriptions.add(
      this.themeService.darkMode$.subscribe(isDark => {
        this.window.themeMode = isDark;
        this.cdr.detectChanges();
      })
    );

    this.initializewindowProperties();
  }

  ngAfterViewInit() {
    if (this.window.component) {
      this.initializeChildComponent();
    }
  }

  private initializeChildComponent() {
    if (!this.componentContainer) {
      console.error('Brak kontenera na komponent potomny');
      return;
    }

    this.componentContainer.clear();
    const componentRef = this.componentContainer.createComponent<DynamicComponent>(
      this.window.component as Type<DynamicComponent>
    );

    // Zachowaj referencję do komponentu
    this.componentRef = componentRef;
    this.window.componentRef = componentRef.instance;

    // Przekaż dane wejściowe
    if (this.window.componentInput) {
      Object.keys(this.window.componentInput).forEach(key => {
        if (componentRef.instance && key in componentRef.instance) {
          componentRef.instance[key] = this.window.componentInput![key];
        }
      });
    }

    // Podłącz handlery zdarzeń
    if (this.window.componentOutput) {
      Object.keys(this.window.componentOutput).forEach(key => {
        const instance = componentRef.instance;
        if (instance && key in instance && instance[key]?.subscribe) {
          this.subscriptions.add(
            instance[key].subscribe((data: any) => {
              const handler = this.window.componentOutput?.[key];
              if (handler) {
                handler(data);
              }
            })
          );
        }
      });
    }

    componentRef.changeDetectorRef.detectChanges();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.subscriptions.unsubscribe();
    const windowElement = this.GetwindowElement();
    if (windowElement) {
      windowElement.classList.remove('dragging', 'maximizing', 'maximized', 'restoring');
    }

    // Zniszcz komponent potomny
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  private initializewindowProperties() {
    // Ustaw domyślne wymiary jeśli nie są zdefiniowane
    this.window.width = this.window.width || 400;
    this.window.height = this.window.height || 300;

    // Wycentruj okno jeśli pozycja nie jest zdefiniowana
    if (this.window.x === undefined || this.window.y === undefined) {
      const centerX = (this.screenBounds.width - this.window.width) / 2;
      const centerY = (this.screenBounds.height - this.window.height) / 2;
      this.window.x = Math.max(0, centerX);
      this.window.y = Math.max(0, centerY);
    }

    // Zawsze aktualizuj zIndex przy inicjalizacji
    this.windowService.bringToFront(this.window.id);
  }

  private handleResize() {
    this.screenBounds = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    if (this.window.isMaximized) {
      this.UpdateMaximizedState();
    }
  }

  startDragging(event: PointerEvent) {
    if (event.button !== 0 || this.window.isMaximized) return;
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    const windowElement = this.GetwindowElement();
    if (windowElement) {
      windowElement.classList.add('dragging');
      windowElement.style.transition = 'none';
    }

    this.dragOffset = {
      x: event.clientX - this.window.x,
      y: event.clientY - this.window.y
    };

    this.windowService.bringToFront(this.window.id);
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  startResizing(event: PointerEvent, direction: string) {
    if (event.button !== 0 || this.window.isMaximized) return;
    event.preventDefault();
    event.stopPropagation();

    this.isResizing = true;
    this.resizeDirection = direction;

    const windowElement = this.GetwindowElement();
    if (windowElement) {
      windowElement.style.transition = 'none';
    }

    this.dragOffset = {
      x: event.clientX,
      y: event.clientY
    };

    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    if (!this.isDragging && !this.isResizing) return;
    event.preventDefault();

    const now = performance.now();
    if (now - this.lastMoveTime < this.THROTTLE_TIME) return;
    this.lastMoveTime = now;

    if (this.isResizing) {
      const dx = event.clientX - this.dragOffset.x;
      const dy = event.clientY - this.dragOffset.y;

      let newWidth = this.window.width;
      let newHeight = this.window.height;
      let newX = this.window.x;
      let newY = this.window.y;

      if (this.resizeDirection.includes('e')) {
        newWidth = Math.max(this.minWidth, this.window.width + dx);
      }
      if (this.resizeDirection.includes('w')) {
        const maxLeftMove = this.window.width - this.minWidth;
        const actualMove = Math.max(-maxLeftMove, Math.min(dx, this.window.x));
        newWidth = this.window.width - actualMove;
        newX = this.window.x + actualMove;
      }
      if (this.resizeDirection.includes('s')) {
        newHeight = Math.max(this.minHeight, this.window.height + dy);
      }
      if (this.resizeDirection.includes('n')) {
        const maxTopMove = this.window.height - this.minHeight;
        const actualMove = Math.max(-maxTopMove, Math.min(dy, this.window.y));
        newHeight = this.window.height - actualMove;
        newY = this.window.y + actualMove;
      }

      // Ograniczenie do granic ekranu
      if (newX + newWidth > this.screenBounds.width) {
        newWidth = this.screenBounds.width - newX;
      }
      if (newY + newHeight > this.screenBounds.height) {
        newHeight = this.screenBounds.height - newY;
      }

      this.window.width = newWidth;
      this.window.height = newHeight;
      this.window.x = newX;
      this.window.y = newY;

      this.dragOffset = {
        x: event.clientX,
        y: event.clientY
      };
    } else {
      let x = event.clientX - this.dragOffset.x;
      let y = event.clientY - this.dragOffset.y;

      x = Math.max(0, Math.min(x, this.screenBounds.width - this.window.width));
      y = Math.max(0, Math.min(y, this.screenBounds.height - this.window.height));

      const windowElement = this.GetwindowElement();
      if (windowElement) {
        windowElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      this.window.x = x;
      this.window.y = y;
    }

    this.cdr.detectChanges();
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    if (this.isResizing) {
      this.isResizing = false;
      this.resizeDirection = '';
      const target = event.target as HTMLElement;
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }
      const windowElement = this.GetwindowElement();
      if (windowElement) {
        windowElement.style.transition = '';
      }
    } else if (this.isDragging) {
      this.isDragging = false;
      const target = event.target as HTMLElement;
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }

      const windowElement = this.GetwindowElement();
      if (windowElement) {
        windowElement.classList.remove('dragging');
        windowElement.style.transition = '';
      }
    }
  }

  onWindowClick(event: MouseEvent) {
    event.stopPropagation();
    this.windowService.bringToFront(this.window.id);
    this.focusWindow();
  }

  private focusWindow() {
    requestAnimationFrame(() => {
      const focusableElement = this.elementRef.nativeElement.querySelector(
        '[autofocus], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled])'
      );
      if (focusableElement) {
        focusableElement.focus();
      }
    });
  }

  private GetwindowElement(): HTMLElement | null {
    return this.elementRef.nativeElement.querySelector('.window');
  }

  // Kontrolki okna
  get windowControls() {
    return [
      {
        class: 'minimize-btn',
        icon: 'bi bi-dash-lg',
        action: () => this.Minimizewindow()
      },
      {
        class: 'maximize-btn',
        icon: `bi ${this.window.isMaximized ? 'bi-window' : 'bi-square'}`,
        action: () => this.Maximizewindow()
      },
      {
        class: 'close-btn',
        icon: 'bi bi-x-lg',
        action: () => this.Closewindow()
      }
    ];
  }

  getWindowClasses(): WindowClasses {
    return {
      active: this.window.isActive,
      minimized: this.window.isMinimized,
      maximized: this.window.isMaximized,
      dragging: this.isDragging
    };
  }

  getWindowStyles(): WindowStyles {
    const styles = {
      '--window-transform': this.getTransformStyle(),
      '--window-width': `${this.window.width}px`,
      '--window-height': `${this.window.height}px`,
      '--window-z-index': this.window.zIndex,
      '--taskbar-height': `${this.TASKBAR_HEIGHT}px`,
      '--taskbar-position-x': '0px',
      '--taskbar-position-y': '100vh'
    } as any;

    return styles;
  }

  private getTransformStyle(): string {
    return `translate3d(${this.window.x}px, ${this.window.y}px, 0)`;
  }

  // Metody kontroli okna
  Maximizewindow() {
    const windowElement = this.GetwindowElement();
    if (!windowElement) return;

    this.window.isMaximized = !this.window.isMaximized;

    if (this.window.isMaximized) {
      this.window.prevState = {
        x: this.window.x,
        y: this.window.y,
        width: this.window.width,
        height: this.window.height
      };

      windowElement.classList.add('maximizing');
      this.UpdateMaximizedState();
      this.cdr.detectChanges();

      setTimeout(() => {
        windowElement.classList.remove('maximizing');
        windowElement.classList.add('maximized');
        this.cdr.detectChanges();
      }, 300);
    } else if (this.window.prevState) {
      windowElement.classList.add('restoring');
      Object.assign(this.window, this.window.prevState);
      this.cdr.detectChanges();

      setTimeout(() => {
        windowElement.classList.remove('maximized', 'restoring');
        this.cdr.detectChanges();
      }, 300);
    }

    this.windowService.bringToFront(this.window.id);
  }

  Minimizewindow() {
    const windowElement = this.GetwindowElement();
    if (!windowElement) return;

    if (!this.window.isMinimized) {
      this.window.prevState = {
        x: this.window.x,
        y: this.window.y,
        width: this.window.width,
        height: this.window.height
      };

      const taskbarButton = document.querySelector(`[data-window-id="${this.window.id}"]`);
      if (taskbarButton) {
        const rect = taskbarButton.getBoundingClientRect();

        windowElement.classList.add('minimizing');
        this.windowService.minimizeWindow(this.window.id);

        this.window.x = rect.left;
        this.window.y = this.screenBounds.height - this.TASKBAR_HEIGHT;
        this.window.width = rect.width;
        this.window.height = this.TASKBAR_HEIGHT;
        this.cdr.detectChanges();

        setTimeout(() => {
          windowElement.classList.remove('minimizing');
          windowElement.classList.add('minimized');
          this.cdr.detectChanges();
        }, 300);
      }
    } else if (this.window.prevState) {
      windowElement.classList.add('restoring');
      this.windowService.restoreWindow(this.window.id);

      Object.assign(this.window, this.window.prevState);
      this.window.prevState = undefined;
      this.cdr.detectChanges();

      setTimeout(() => {
        windowElement.classList.remove('minimized', 'restoring');
        this.cdr.detectChanges();
      }, 300);
    }

    this.windowService.bringToFront(this.window.id);
  }

  Closewindow() {
    this.windowService.closeWindow(this.window.id);
  }

  private UpdateMaximizedState() {
    if (this.window.isMaximized) {
      if (!this.window.prevState) {
        this.window.prevState = {
          x: this.window.x,
          y: this.window.y,
          width: this.window.width,
          height: this.window.height
        };
      }

      requestAnimationFrame(() => {
        this.window.x = 0;
        this.window.y = 0;
        this.window.width = this.screenBounds.width;
        this.window.height = this.screenBounds.height - this.TASKBAR_HEIGHT;
        this.cdr.detectChanges();
      });
    } else if (this.window.prevState) {
      requestAnimationFrame(() => {
        Object.assign(this.window, this.window.prevState);
        this.window.prevState = undefined;
        this.cdr.detectChanges();
      });
    }
  }

  // Metody drag-and-drop
  onDragStart(event: DragEvent) {
    if (!this.window.isDraggable) return;

    const dragData: DragDropData = {
      sourceWindowId: this.window.id,
      content: event.target instanceof HTMLElement ? event.target.textContent || '' : '',
      type: 'text'
    };
    event.dataTransfer?.setData('application/json', JSON.stringify(dragData));
  }

  onDragOver(event: DragEvent) {
    if (!this.window.isDraggable) return;

    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    if (!this.window.isDraggable) return;

    event.preventDefault();
    const jsonData = event.dataTransfer?.getData('application/json');
    if (!jsonData) return;

    try {
      const dragData: DragDropData = JSON.parse(jsonData);
      const target = event.target as HTMLElement;

      if (dragData.type === 'text' && target.classList.contains('draggable-container')) {
        const draggableItem = document.createElement('div');
        draggableItem.className = 'draggable-item';
        draggableItem.draggable = true;
        draggableItem.textContent = dragData.content;
        target.appendChild(draggableItem);
      }
    } catch (error) {
      console.error('Błąd podczas przetwarzania danych drag-drop:', error);
    }
  }

  // Dodanie obsługi klawisza Enter
  @HostListener('window:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    // Powstrzymaj domyślne zachowanie, które może powodować minimalizację
    event.preventDefault();
    event.stopPropagation();
  }
}

