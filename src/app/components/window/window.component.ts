import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { WindowModel } from '../../models/window.model';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-window',
  template: `
    <div class="window"
         [style.left.px]="window.x"
         [style.top.px]="window.y"
         [style.width.px]="window.width"
         [style.height.px]="window.height"
         [style.z-index]="window.zIndex"
         (mousedown)="onWindowClick()">
      <div class="window-header" (mousedown)="startDragging($event)">
        {{ window.title }}
        <button class="close-btn" (click)="closeWindow()">×</button>
      </div>
      <div class="window-content">
        <ng-container *ngComponentOutlet="window.component"></ng-container>
      </div>
    </div>
  `,
  styles: [`
    .window {
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .window-header {
      padding: 8px;
      background: #f0f0f0;
      border-bottom: 1px solid #ccc;
      cursor: move;
      user-select: none;
    }
    .close-btn {
      float: right;
      border: none;
      background: none;
      cursor: pointer;
    }
    .window-content {
      padding: 16px;
    }
  `]
})
export class WindowComponent {
  @Input() window!: WindowModel;
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };

  constructor(
    private windowService: WindowService,
    private elementRef: ElementRef
  ) {}

  onWindowClick() {
    this.windowService.bringToFront(this.window.id);
  }

  closeWindow() {
    this.windowService.closeWindow(this.window.id);
  }

  startDragging(event: MouseEvent) {
    this.isDragging = true;
    this.dragOffset.x = event.clientX - this.window.x;
    this.dragOffset.y = event.clientY - this.window.y;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.window.x = event.clientX - this.dragOffset.x;
      this.window.y = event.clientY - this.dragOffset.y;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }
}
