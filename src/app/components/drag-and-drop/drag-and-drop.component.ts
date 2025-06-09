import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DraggableItem {
  id: string;
  text: string;
}

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
        *ngFor="let item of items"
        class="draggable-item"
        [draggable]="isDraggable"
        [id]="item.id"
        >
        {{ item.text }}
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
export class DragAndDropComponent implements OnInit {
  @Input() isDraggable: boolean = false;
  items: DraggableItem[] = [];

  ngOnInit() {
    // Inicjalizacja przykładowego elementu
    this.items.push({
      id: 'draggable-' + Date.now(),
      text: 'Przeciągnij mnie'
    });
  }

  onDragStart(event: DragEvent) {
    if (!this.isDraggable || !event.target) return;

    const target = event.target as HTMLElement;
    if (!target.classList.contains('draggable-item')) return;

    event.dataTransfer?.setData('application/element-id', target.id);
  }

  onDragOver(event: DragEvent) {
    if (!this.isDraggable) return;

    event.preventDefault();
    event.stopPropagation();

    // Sprawdzamy, czy przeciągamy nad kontenerem
    const dropTarget = event.target as HTMLDivElement;
    if (dropTarget.classList.contains('draggable-container')) {
      dropTarget.style.borderStyle = 'solid';
    }
  }

  onDrop(event: DragEvent) {
    if (!this.isDraggable || !event.dataTransfer) return;

    event.preventDefault();

    const dropTarget = event.target as HTMLElement;
    const container = dropTarget.closest('.draggable-container') as HTMLDivElement;
    if (!container) return;

    // Przywracamy oryginalny styl bordera
    container.style.borderStyle = 'dashed';

    const elementId = event.dataTransfer.getData('application/element-id');
    const draggedElement = document.getElementById(elementId);

    if (draggedElement) {
      const sourceContainer = draggedElement.parentElement;
      if (sourceContainer !== container) {
        // Znajdujemy element w źródłowej tablicy items
        const item = this.items.find(i => i.id === elementId);
        if (item) {
          // Przenosimy element fizycznie do nowego kontenera
          container.appendChild(draggedElement);
        }
      }
    }
  }
}
