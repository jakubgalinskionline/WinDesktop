import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropService, DraggableItem } from '../../services/drag-and-drop.service';
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
  @Input() items?: DraggableItem[];

  displayedItems: DraggableItem[] = [];
  isDragging: boolean = false;
  draggedId: string | null = null;
  private subscription?: Subscription;

  constructor(private dragDropService: DragAndDropService) {}

  ngOnInit() {
    this.dragDropService.initializeItems(this.containerId, this.items);
    this.subscription = this.dragDropService.items$.subscribe(() => {
      this.displayedItems = this.dragDropService.getItemsForContainer(this.containerId);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onDragStart(event: DragEvent) {
    if (!event.dataTransfer || !event.target) return;

    const target = event.target as HTMLElement;
    this.isDragging = true;
    this.draggedId = target.id;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', target.id);
  }

  onDragEnd(event: DragEvent) {
    this.isDragging = false;
    this.draggedId = null;
  }

  onDragOver(event: DragEvent) {
    if (!event.dataTransfer) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;

    const elementId = event.dataTransfer.getData('text/plain');
    this.dragDropService.moveItem(elementId, this.containerId);
  }

  deleteItem(itemId: string) {
    this.dragDropService.deleteItem(itemId, this.containerId);
  }
}
