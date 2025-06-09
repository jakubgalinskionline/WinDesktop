import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropService, DraggableItem } from '../../services/drag-drop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
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
