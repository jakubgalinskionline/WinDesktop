import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropComponent } from '../drag-and-drop/drag-and-drop.component';

@Component({
  selector: 'app-dual-container',
  standalone: true,
  imports: [CommonModule, DragAndDropComponent],
  template: `
    <div class="dual-container">
      <app-drag-and-drop
        [containerId]="'container-1'"
        [isDraggable]="true"
      ></app-drag-and-drop>
      <app-drag-and-drop
        [containerId]="'container-2'"
        [isDraggable]="true"
      ></app-drag-and-drop>
    </div>
  `,
  styles: [`
    .dual-container {
      display: flex;
      gap: 20px;
      padding: 10px;
    }

    app-drag-and-drop {
      flex: 1;
      min-width: 0;
    }
  `]
})
export class DualContainerComponent {}
