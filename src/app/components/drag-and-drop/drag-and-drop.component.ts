import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropService, DraggableItem } from '../../services/drag-drop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Debug info -->
    <div style="font-size: 10px; color: #999; margin-bottom: 5px;">
      Container ID: {{ containerId }}
      Items: {{ items.length }}
    </div>
    <div
      class="draggable-container"
      [id]="containerId"
      [attr.data-draggable-group]="isDraggable ? 'draggable-group' : ''"
      (dragstart)="onDragStart($event)"
      (dragover)="onDragOver($event)"
      (dragenter)="onDragEnter($event)"
      (dragleave)="onDragLeave($event)"
      (dragend)="onDragEnd($event)"
      (drop)="onDrop($event)">
      <div
        *ngFor="let item of items"
        class="draggable-item-wrapper">
        <button
          class="draggable-item"
          [draggable]="isDraggable"
          [id]="item.id"
          [class.dragging]="isDragging && draggedId === item.id"
          type="button">
          {{ item.text }}
        </button>
        <button
          class="delete-button"
          type="button"
          (click)="deleteItem(item.id)"
          title="Usuń element">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .draggable-container {
      padding: 20px;
      border: 2px dashed rgba(0, 123, 255, 0.2);
      border-radius: 8px;
      min-height: 120px;
      margin: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      transition: all 0.3s ease;
    }

    .draggable-item-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
    }    .delete-button {
      position: absolute;
      right: -6px;
      top: -4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #dc3545;
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.2s ease;
      padding: 0;
      font-size: 10px;
      z-index: 1;
    }

    .draggable-item-wrapper:hover .delete-button {
      opacity: 1;
      transform: scale(1);
    }

    .delete-button:hover {
      background: #c82333;
      transform: scale(1.1);
    }

    .draggable-container.drag-over {
      border-color: #007bff;
      background-color: rgba(0, 123, 255, 0.05);
      box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1);
      transform: scale(1.01);
    }

    .draggable-item {
      background-color: #fff;
      color: #444;
      padding: 10px 20px;
      margin: 0;
      cursor: grab;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 14px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
    }

    .draggable-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .draggable-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #007bff;
      background-color: #f8f9fa;
    }

    .draggable-item:hover::before {
      transform: translateX(100%);
    }

    .draggable-item.dragging {
      opacity: 0.6;
      transform: scale(1.05);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      background-color: #e9ecef;
      cursor: grabbing;
    }

    .draggable-item:active {
      cursor: grabbing;
    }

    .draggable-item[draggable='false'] {
      cursor: not-allowed;
      background-color: #f5f5f5;
      opacity: 0.7;
      border-color: #ddd;
    }

    @media (hover: hover) {
      .draggable-item:hover {
        background-color: #f8f9fa;
      }
    }
  `]
})
export class DragAndDropComponent implements OnInit, OnDestroy {
  @Input() isDraggable: boolean = true;
  @Input() containerId!: string;

  items: DraggableItem[] = [];
  isDragging: boolean = false;
  draggedId: string | null = null;
  private subscription?: Subscription;

  constructor(private dragDropService: DragDropService) {}

  ngOnInit() {
    this.dragDropService.initializeItems(this.containerId);
    this.subscription = this.dragDropService.items$.subscribe(() => {
      this.items = this.dragDropService.getItemsForContainer(this.containerId);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onDragStart(event: DragEvent) {
    if (!this.isDraggable || !event.target) return;

    const target = event.target as HTMLElement;
    if (!target.classList.contains('draggable-item')) return;

    this.isDragging = true;
    this.draggedId = target.id;
    event.dataTransfer?.setData('application/element-id', target.id);

    // Dodaj efekt przezroczystości
    target.classList.add('dragging');
  }

  onDragEnd(event: DragEvent) {
    this.isDragging = false;
    this.draggedId = null;

    // Usuń wszystkie efekty przeciągania
    document.querySelectorAll('.draggable-item.dragging').forEach(el => {
      el.classList.remove('dragging');
    });
    document.querySelectorAll('.draggable-container.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
  }

  onDragOver(event: DragEvent) {
    if (!this.isDraggable) return;
    event.preventDefault();
    event.stopPropagation();
  }

  onDragEnter(event: DragEvent) {
    if (!this.isDraggable) return;
    const container = (event.target as HTMLElement).closest('.draggable-container');
    container?.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    if (!this.isDraggable) return;
    const container = (event.target as HTMLElement).closest('.draggable-container');
    container?.classList.remove('drag-over');
  }

  onDrop(event: DragEvent) {
    if (!this.isDraggable || !event.dataTransfer) return;
    event.preventDefault();

    // Znajdź kontener
    const container = (event.target as HTMLElement).closest('.draggable-container');
    if (!container) return;

    // Usuń efekt przeciągania
    container.classList.remove('drag-over');

    const elementId = event.dataTransfer.getData('application/element-id');
    if (!elementId) return;

    // Aktualizuj pozycję elementu przez serwis
    this.dragDropService.moveItem(elementId, this.containerId);

    this.isDragging = false;
    this.draggedId = null;
  }

  deleteItem(itemId: string) {
    this.dragDropService.deleteItem(itemId, this.containerId);
  }
}
