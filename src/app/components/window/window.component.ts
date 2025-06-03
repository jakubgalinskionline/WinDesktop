import { Component, Input, ElementRef, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { WindowModel } from '../../models/window.model';
import { WindowService } from '../../services/window.service';
import { CommonModule, NgComponentOutlet } from '@angular/common';
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
export class WindowComponent implements OnInit {
  @Input() Window!: WindowModel;
  @Input() isDarkMode$!: boolean;

  public isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private screenBounds = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  private readonly TASKBAR_HEIGHT = 40;

  constructor(
    private WindowService: WindowService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService
  ) {
    // resize
    window.addEventListener('resize', this.handleResize.bind(this));

    // dark mode
    this.themeService.darkMode$.subscribe(isDark => {
        this.Window.isDarkMode = isDark;
        this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    // Ustaw początkowe wymiary okna jeśli nie są zdefiniowane
    if (!this.Window.width) this.Window.width = 400;
    if (!this.Window.height) this.Window.height = 300;

    // Wycentruj okno jeśli pozycja nie jest zdefiniowana
    if (this.Window.x === undefined) {
      this.Window.x = (this.screenBounds.width - this.Window.width) / 2;
    }
    if (this.Window.y === undefined) {
      this.Window.y = (this.screenBounds.height - this.Window.height) / 2;
    }

    // Ustaw początkowy z-index
    if (!this.Window.zIndex) this.Window.zIndex = 1000;
  }

  // jesli usunę klase onOnDestroy to działa
  // poprawnie zamykanie okna
  // jeśli jest dodana klasa to zamyka na każdej ikonie okna
  // ngOnDestroy() {
  //   window.removeEventListener('resize', this.handleResize.bind(this));
  //   // Cleanup any additional resources if needed
  //   this.elementRef.nativeElement.querySelector('.window').classList.remove('dragging', 'maximizing', 'maximized', 'restoring');
  //   this.windowService.closeWindow(this.window.id);
  // }

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
      this.Window.height = this.screenBounds.height - this.TASKBAR_HEIGHT; // Odejmij wysokość paska zadań
    }
  }

  private GetWindowElement(): HTMLElement {
    return this.elementRef.nativeElement.querySelector('.window');
  }

  MaximizeWindow() {
      const windowElement = this.GetWindowElement();
      this.Window.isMaximized = !this.Window.isMaximized;

      if (this.Window.isMaximized) {
          // Zapisz aktualny stan
          this.Window.prevState = {
              x: this.Window.x,
              y: this.Window.y,
              width: this.Window.width,
              height: this.Window.height
          };

          // Animacja maksymalizacji
          windowElement.classList.add('maximizing');
          this.UpdateMaximizedState();
          this.cdr.detectChanges();

          setTimeout(() => {
              windowElement.classList.remove('maximizing');
              windowElement.classList.add('maximized');
              this.cdr.detectChanges();
          }, 300);
      } else {
          if (this.Window.prevState) {
              windowElement.classList.add('restoring');
              Object.assign(this.Window, this.Window.prevState);
              this.cdr.detectChanges();

              setTimeout(() => {
                  windowElement.classList.remove('maximized', 'restoring');
                  this.cdr.detectChanges();
              }, 300);
          }
      }

      this.WindowService.BringToFront(this.Window.id);
  }

  MinimizeWindow() {
      const windowElement = this.GetWindowElement();

      if (!this.Window.isMinimized) {
          // Zapisz aktualny stan
          this.Window.prevState = {
              x: this.Window.x,
              y: this.Window.y,
              width: this.Window.width,
              height: this.Window.height
          };

          // Znajdź pozycję przycisku na pasku zadań
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
      } else {
          // Przywracanie okna
          windowElement.classList.add('restoring');

          if (this.Window.prevState) {
              Object.assign(this.Window, this.Window.prevState);
              this.Window.isMinimized = false;
              this.cdr.detectChanges();

              setTimeout(() => {
                  windowElement.classList.remove('minimized', 'restoring');
                  this.cdr.detectChanges();
              }, 300);
          }
      }

      this.WindowService.BringToFront(this.Window.id);
  }

  // onWindowClick() {
  //   this.windowService.bringToFront(this.window.id);
  //   this.focusWindow();
  // }

  onWindowClick(event: MouseEvent) {
    // Zatrzymaj propagację, aby uniknąć konfliktu z innymi oknami
    event.stopPropagation();

    // Przenieś okno na wierzch
    this.WindowService.BringToFront(this.Window.id);

    // Nadaj focus
    this.focusWindow();

    // Dodaj klasę aktywności
    const AllWindows = document.querySelectorAll('.window');
    AllWindows.forEach(w => w.classList.remove('active'));
    this.GetWindowElement().classList.add('active');
  }

  private focusWindow() {
    // Znajdź pierwszy element do focusu w oknie
    const focusableElement = this.elementRef.nativeElement.querySelector('[autofocus], input, textarea, select, button');
    if (focusableElement) {
      setTimeout(() => {
        focusableElement.focus();
      });
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    let newX = event.clientX - this.dragOffset.x;
    let newY = event.clientY - this.dragOffset.y;

    // Ograniczenie pozycji okna do granic ekranu
    newX = Math.max(0, Math.min(newX, this.screenBounds.width - this.Window.width));
    newY = Math.max(0, Math.min(newY, this.screenBounds.height - this.Window.height));

    this.Window.x = newX;
    this.Window.y = newY;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.elementRef.nativeElement.querySelector('.window').classList.remove('dragging');
  }

  CloseWindow() {
    this.WindowService.CloseWindow(this.Window.id);
  }

  getTransformStyle(): string {
    return `translate3d(${this.Window.x}px, ${this.Window.y}px, 0)`;
  }

  startDragging(event: PointerEvent) {
    if (event.button !== 0) return; // tylko lewy przycisk

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
}
