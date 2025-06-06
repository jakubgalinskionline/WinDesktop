import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, Input, ElementRef, HostListener, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';

import { WindowModel } from '../../models/window/window.model';
import { WindowClasses } from '../../models/window/windowClasses.model';
import { WindowStyles } from '../../models/window/windowStyles.model';
import { WindowService } from '../../services/window.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  host: {
    '[class.window-container]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowComponent implements OnInit, OnDestroy {
  @Input() window!: WindowModel;
  @Input() isDarkMode: boolean = false;

  public isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private screenBounds = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  private readonly TASKBAR_HEIGHT = 40;
  private subscriptions = new Subscription();
  private lastMoveTime = 0;
  private readonly THROTTLE_TIME = 16; // około 60 FPS

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
    // Przekaż kontekst okna    (window as any).currentwindowId = this.window.id;
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

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.subscriptions.unsubscribe();
    const windowElement = this.GetwindowElement();
    if (windowElement) {
      windowElement.classList.remove('dragging', 'maximizing', 'maximized', 'restoring');
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

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    if (!this.isDragging) return;
    event.preventDefault();

    const now = performance.now();
    if (now - this.lastMoveTime < this.THROTTLE_TIME) return;
    this.lastMoveTime = now;

    let x = event.clientX - this.dragOffset.x;
    let y = event.clientY - this.dragOffset.y;

    // Ograniczamy pozycję do granic ekranu
    x = Math.max(0, Math.min(x, this.screenBounds.width - this.window.width));
    y = Math.max(0, Math.min(y, this.screenBounds.height - this.window.height));

    const windowElement = this.GetwindowElement();
    if (windowElement) {
      windowElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    // Aktualizacja pozycji w modelu
    this.window.x = x;
    this.window.y = y;
    this.cdr.detectChanges();
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    if (!this.isDragging) return;
    event.preventDefault();

    this.isDragging = false;
    const target = event.target as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }

    const windowElement = this.GetwindowElement();
    if (windowElement) {
      windowElement.classList.remove('dragging');
      windowElement.style.transition = '';
    }    // Pozycja została już zaktualizowana przez onPointerMove
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
}

