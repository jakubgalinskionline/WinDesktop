import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="draggable-container"
      [attr.data-draggable-group]="isDraggable ? 'draggable-group' : ''"
      (dragstart)="onDragStart($event)"
      (dragover)="onDragOver($event)"
      (drop)="onDrop($event)">
      <div
        class="draggable-item"
        [draggable]="isDraggable"
        >
        Przeciągnij mnie
      </div>
    </div>
  `,
  styles: [`
    .draggable-container {
      padding: 20px;
      border: 2px dashed #ccc;
      min-height: 100px;
      margin: 10px;
    }

    .draggable-item {
      background-color: #4CAF50;
      color: white;
      padding: 10px;
      margin: 5px;
      cursor: move;
      display: inline-block;
      border-radius: 4px;
    }

    .draggable-item[draggable='false'] {
      cursor: not-allowed;
      background-color: #cccccc;
    }
  `]
})
export class DragAndDropComponent {
  @Input() isDraggable: boolean = false;

  onDragStart(event: DragEvent) {
    if (!this.isDraggable) return;

    const target = event.target as HTMLElement;
    event.dataTransfer?.setData('text/plain', target.textContent || '');

    // Dodajemy identyfikator przeciąganego elementu
    target.id = 'dragged-element-' + Date.now();
    event.dataTransfer?.setData('text/id', target.id);
  }

  onDragOver(event: DragEvent) {
    if (!this.isDraggable) return;

    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    if (!this.isDraggable) return;

    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    const draggedId = event.dataTransfer?.getData('text/id');
    const container = event.target as HTMLElement;

    if (data && container.classList.contains('draggable-container')) {
      // Usuwamy oryginalny element
      if (draggedId) {
        const originalElement = document.getElementById(draggedId);
        originalElement?.remove();
      }

      // Tworzymy nowy element w docelowym kontenerze
      const draggableItem = document.createElement('div');
      draggableItem.className = 'draggable-item';
      draggableItem.draggable = true;
      draggableItem.textContent = data;
      container.appendChild(draggableItem);
    }
  }
}
