import { Component, Input, ElementRef, HostListener, OnInit } from '@angular/core';
import { WindowModel } from '../../models/window.model';
import { WindowService } from '../../services/window.service';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
  standalone: true,
  imports: [NgComponentOutlet],
  host: {
    '[class.window-container]': 'true'
  }
})
export class WindowComponent implements OnInit {
  @Input() window!: WindowModel;
  public isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private screenBounds = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  private readonly TASKBAR_HEIGHT = 40;

  constructor(
    private windowService: WindowService,
    private elementRef: ElementRef
  ) {
    window.addEventListener('resize', this.handleResize.bind(this));
  }


  ngOnInit() {
    // Ustaw początkowe wymiary okna jeśli nie są zdefiniowane
    if (!this.window.width) this.window.width = 400;
    if (!this.window.height) this.window.height = 300;

    // Wycentruj okno jeśli pozycja nie jest zdefiniowana
    if (this.window.x === undefined) {
      this.window.x = (this.screenBounds.width - this.window.width) / 2;
    }
    if (this.window.y === undefined) {
      this.window.y = (this.screenBounds.height - this.window.height) / 2;
    }

    // Ustaw początkowy z-index
    if (!this.window.zIndex) this.window.zIndex = 1000;
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

    if (this.window.isMaximized) {
      this.updateMaximizedState();
    }
  }

  private updateMaximizedState() {
    if (this.window.isMaximized) {
      this.window.x = 0;
      this.window.y = 0;
      this.window.width = this.screenBounds.width;
      this.window.height = this.screenBounds.height - this.TASKBAR_HEIGHT; // Odejmij wysokość paska zadań
    }
  }

  private getWindowElement(): HTMLElement {
    return this.elementRef.nativeElement.querySelector('.window');
  }

  maximizeWindow() {
    this.window.isMaximized = !this.window.isMaximized;
    const windowElement = this.getWindowElement();

    if (this.window.isMaximized) {
      // Zapisz aktualny stan przed maksymalizacją
      this.window.prevState = {
        x: this.window.x,
        y: this.window.y,
        width: this.window.width,
        height: this.window.height
      };

      // Dodaj klasę przed animacją
      windowElement.classList.add('maximizing');

      // Animowana maksymalizacja
      requestAnimationFrame(() => {
        this.updateMaximizedState();
        windowElement.classList.add('maximized');
        windowElement.classList.remove('maximizing');
      });
    } else {
      // Przywróć poprzedni stan okna
      if (this.window.prevState) {
        windowElement.classList.add('restoring');

        requestAnimationFrame(() => {
          Object.assign(this.window, this.window.prevState);
          windowElement.classList.remove('maximized', 'restoring');
        });
      }
    }

    // Przenieś okno na wierzch
    this.windowService.bringToFront(this.window.id);
  }

  minimizeWindow() {
    const windowElement = this.getWindowElement();

    if (!this.window.isMinimized) {
      // Zapisz aktualny stan przed minimalizacją
      this.window.prevState = {
        x: this.window.x,
        y: this.window.y,
        width: this.window.width,
        height: this.window.height
      };

      // Dodaj klasę animacji
      windowElement.classList.add('minimizing');

      // Animowana minimalizacja
      requestAnimationFrame(() => {
        // Pobierz pozycję przycisku na pasku zadań
        const taskbarButton = document.querySelector(`[data-window-id="${this.window.id}"]`);
        if (taskbarButton) {
          const rect = taskbarButton.getBoundingClientRect();
          this.window.x = rect.left;
          this.window.y = this.screenBounds.height - this.TASKBAR_HEIGHT;
          this.window.width = rect.width;
          this.window.height = 0;
        }

        this.window.isMinimized = true;
        windowElement.classList.add('minimized');
        windowElement.classList.remove('minimizing');
      });
    } else {
      // Przywracanie okna
      windowElement.classList.add('restoring');

      requestAnimationFrame(() => {
        if (this.window.prevState) {
          Object.assign(this.window, this.window.prevState);
        }
        this.window.isMinimized = false;
        windowElement.classList.remove('minimized', 'restoring');
      });
    }

    // Aktualizuj z-index
    this.windowService.bringToFront(this.window.id);
  }

  // onWindowClick() {
  //   this.windowService.bringToFront(this.window.id);
  //   this.focusWindow();
  // }

  onWindowClick(event: MouseEvent) {
    // Zatrzymaj propagację, aby uniknąć konfliktu z innymi oknami
    event.stopPropagation();

    // Przenieś okno na wierzch
    this.windowService.bringToFront(this.window.id);

    // Nadaj focus
    this.focusWindow();

    // Dodaj klasę aktywności
    const allWindows = document.querySelectorAll('.window');
    allWindows.forEach(w => w.classList.remove('active'));
    this.getWindowElement().classList.add('active');
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
    newX = Math.max(0, Math.min(newX, this.screenBounds.width - this.window.width));
    newY = Math.max(0, Math.min(newY, this.screenBounds.height - this.window.height));

    this.window.x = newX;
    this.window.y = newY;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.elementRef.nativeElement.querySelector('.window').classList.remove('dragging');
  }

  closeWindow() {
    this.windowService.closeWindow(this.window.id);
  }

  getTransformStyle(): string {
    return `translate3d(${this.window.x}px, ${this.window.y}px, 0)`;
  }

  startDragging(event: PointerEvent) {
    if (event.button !== 0) return; // tylko lewy przycisk

    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    this.dragOffset = {
      x: event.clientX - this.window.x,
      y: event.clientY - this.window.y
    };

    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    if (!this.isDragging) return;

    requestAnimationFrame(() => {
      this.window.x = event.clientX - this.dragOffset.x;
      this.window.y = event.clientY - this.dragOffset.y;
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
    this.window.x = Math.max(0, Math.min(this.window.x, this.screenBounds.width - this.window.width));
    this.window.y = Math.max(0, Math.min(this.window.y, this.screenBounds.height - this.window.height));
  }
}
