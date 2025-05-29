import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { WindowModel } from '../../models/window.model';
import { WindowService } from '../../services/window.service';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-window',
  templateUrl:  `./window.component.html`,
  styleUrls: ['./window.component.css'],
  standalone: true,
  imports: [NgComponentOutlet],
})
export class WindowComponent {
  @Input() window!: WindowModel;
  public isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private screenBounds = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  constructor(
    private windowService: WindowService,
    private elementRef: ElementRef
  ) {
    window.addEventListener('resize', () => {
      this.screenBounds = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    });
  }

  onWindowClick() {
    this.windowService.bringToFront(this.window.id);
  }

  startDragging(event: MouseEvent) {
    if (event.button !== 0) return; // tylko lewy przycisk myszy
    event.preventDefault();
    this.isDragging = true;
    this.dragOffset.x = event.clientX - this.window.x;
    this.dragOffset.y = event.clientY - this.window.y;
    this.elementRef.nativeElement.querySelector('.window').classList.add('dragging');
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

  minimizeWindow() {
    // TODO: Implementacja minimalizacji
    this.window.isMinimized = !this.window.isMinimized;
  }

  maximizeWindow() {
    // TODO: Implementacja maksymalizacji
    this.window.isMaximized = !this.window.isMaximized;
    if (this.window.isMaximized) {
      this.window.prevState = {
        x: this.window.x,
        y: this.window.y,
        width: this.window.width,
        height: this.window.height
      };
      this.window.x = 0;
      this.window.y = 0;
      this.window.width = this.screenBounds.width;
      this.window.height = this.screenBounds.height;
    } else if (this.window.prevState) {
      Object.assign(this.window, this.window.prevState);
    }
  }
}
