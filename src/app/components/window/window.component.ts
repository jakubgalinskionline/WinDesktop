import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, Input, ElementRef, HostListener, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { WindowModel } from '../../models/window.model';
import { WindowClasses } from './WindowClasses.model';
import { WindowStyles } from './windowStyles.model';
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
  }
})
export class WindowComponent implements OnInit, OnDestroy {
  @Input() Window!: WindowModel;
  @Input() isDarkMode$!: boolean;

  public isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private screenBounds = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  private readonly TASKBAR_HEIGHT = 40;
  private subscriptions = new Subscription();

  constructor(
    private WindowService: WindowService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  ngOnInit() {
    // Przekaż kontekst okna
    (window as any).currentWindowId = this.Window.id;
    (window as any).currentWindowComponent = this;

    // Subskrybuj tryb ciemny
    this.subscriptions.add(      this.themeService.darkMode$.subscribe(isDark => {
        this.Window.themeMode = isDark;
        this.cdr.detectChanges();
      })
    );

    this.initializeWindowProperties();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.subscriptions.unsubscribe();
    const windowElement = this.GetWindowElement();
    if (windowElement) {
      windowElement.classList.remove('dragging', 'maximizing', 'maximized', 'restoring');
    }
  }

  private initializeWindowProperties() {
    if (!this.Window.width) this.Window.width = 400;
    if (!this.Window.height) this.Window.height = 300;
    if (this.Window.x === undefined) {
      this.Window.x = (this.screenBounds.width - this.Window.width) / 2;
    }
    if (this.Window.y === undefined) {
      this.Window.y = (this.screenBounds.height - this.Window.height) / 2;
    }
    if (!this.Window.zIndex) this.Window.zIndex = 1000;
  }

  private handleResize() {
    this.screenBounds = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    if (this.Window.isMaximized) {
      this.UpdateMaximizedState();
    }
  }

  private UpdateMaximizedState() {
    if (this.Window.isMaximized) {
      this.Window.x = 0;
      this.Window.y = 0;
      this.Window.width = this.screenBounds.width;
      this.Window.height = this.screenBounds.height - this.TASKBAR_HEIGHT;
    }
  }

  private GetWindowElement(): HTMLElement {
    return this.elementRef.nativeElement.querySelector('.window');
  }

  MaximizeWindow() {
    const windowElement = this.GetWindowElement();
    this.Window.isMaximized = !this.Window.isMaximized;

    if (this.Window.isMaximized) {
      this.Window.prevState = {
        x: this.Window.x,
        y: this.Window.y,
        width: this.Window.width,
        height: this.Window.height
      };

      windowElement.classList.add('maximizing');
      this.UpdateMaximizedState();
      this.cdr.detectChanges();

      setTimeout(() => {
        windowElement.classList.remove('maximizing');
        windowElement.classList.add('maximized');
        this.cdr.detectChanges();
      }, 300);
    } else if (this.Window.prevState) {
      windowElement.classList.add('restoring');
      Object.assign(this.Window, this.Window.prevState);
      this.cdr.detectChanges();

      setTimeout(() => {
        windowElement.classList.remove('maximized', 'restoring');
        this.cdr.detectChanges();
      }, 300);
    }

    this.WindowService.BringToFront(this.Window.id);
  }

  MinimizeWindow() {
    const windowElement = this.GetWindowElement();

    if (!this.Window.isMinimized) {
      this.Window.prevState = {
        x: this.Window.x,
        y: this.Window.y,
        width: this.Window.width,
        height: this.Window.height
      };

      const taskbarButton = document.querySelector(`[data-window-id="${this.Window.id}"]`);
      if (taskbarButton) {
        const rect = taskbarButton.getBoundingClientRect();

        windowElement.classList.add('minimizing');
        this.Window.isMinimized = true;
        this.Window.x = rect.left;
        this.Window.y = this.screenBounds.height - this.TASKBAR_HEIGHT;
        this.Window.width = rect.width;
        this.Window.height = this.TASKBAR_HEIGHT;
        this.cdr.detectChanges();

        setTimeout(() => {
          windowElement.classList.remove('minimizing');
          windowElement.classList.add('minimized');
          this.cdr.detectChanges();
        }, 300);
      }
    } else if (this.Window.prevState) {
      windowElement.classList.add('restoring');
      Object.assign(this.Window, this.Window.prevState);
      this.Window.isMinimized = false;
      this.cdr.detectChanges();

      setTimeout(() => {
        windowElement.classList.remove('minimized', 'restoring');
        this.cdr.detectChanges();
      }, 300);
    }

    this.WindowService.BringToFront(this.Window.id);
  }

  onWindowClick(event: MouseEvent) {
    event.stopPropagation();
    this.WindowService.BringToFront(this.Window.id);
    this.focusWindow();
    const AllWindows = document.querySelectorAll('.window');
    AllWindows.forEach(w => w.classList.remove('active'));
    this.GetWindowElement().classList.add('active');
  }

  private focusWindow() {
    const focusableElement = this.elementRef.nativeElement.querySelector('[autofocus], input, textarea, select, button');
    if (focusableElement) {
      setTimeout(() => focusableElement.focus());
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    let newX = event.clientX - this.dragOffset.x;
    let newY = event.clientY - this.dragOffset.y;
    newX = Math.max(0, Math.min(newX, this.screenBounds.width - this.Window.width));
    newY = Math.max(0, Math.min(newY, this.screenBounds.height - this.Window.height));
    this.Window.x = newX;
    this.Window.y = newY;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.GetWindowElement().classList.remove('dragging');
  }

  CloseWindow() {
    this.WindowService.CloseWindow(this.Window.id);
  }

  getTransformStyle(): string {
    return `translate3d(${this.Window.x}px, ${this.Window.y}px, 0)`;
  }

  startDragging(event: PointerEvent) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
    this.dragOffset = {
      x: event.clientX - this.Window.x,
      y: event.clientY - this.Window.y
    };
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    if (!this.isDragging) return;
    requestAnimationFrame(() => {
      this.Window.x = event.clientX - this.dragOffset.x;
      this.Window.y = event.clientY - this.dragOffset.y;
      this.constrainWindowToBounds();
    });
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
  }

  private constrainWindowToBounds() {
    this.Window.x = Math.max(0, Math.min(this.Window.x, this.screenBounds.width - this.Window.width));
    this.Window.y = Math.max(0, Math.min(this.Window.y, this.screenBounds.height - this.Window.height));
  }

  windowControls = [
    {
      class: 'minimize-btn',
      icon: 'bi bi-dash-lg',
      action: () => this.MinimizeWindow()
    },
    {
      class: 'maximize-btn',
      icon: 'bi bi-square',
      action: () => this.MaximizeWindow()
    },
    {
      class: 'close-btn',
      icon: 'bi bi-x-lg',
      action: () => this.CloseWindow()
    }
  ];

  getWindowClasses(): WindowClasses {
    return {
      active: this.Window.isActive,
      minimized: this.Window.isMinimized,
      maximized: this.Window.isMaximized,
      dragging: this.isDragging
    };
  }

  getWindowStyles(): WindowStyles {
    return {
      transform: this.getTransformStyle(),
      width: `${this.Window.width}px`,
      height: `${this.Window.height}px`,
      zIndex: this.Window.zIndex
    };
  }

}

