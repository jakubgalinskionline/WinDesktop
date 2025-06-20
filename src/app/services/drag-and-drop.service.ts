import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DraggableItem {
  id: string;
  icon: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {
  private containerItems: Map<string, DraggableItem[]>;
  private itemsSubject: BehaviorSubject<void>;
  items$: Observable<void>;  private nextId: number;
  private initialized: boolean;

  constructor() {
    this.containerItems = new Map<string, DraggableItem[]>();
    this.itemsSubject = new BehaviorSubject<void>(undefined);
    this.items$ = this.itemsSubject.asObservable();
    this.nextId = 1;
    this.initialized = false;
  }
  initializeItems(containerId: string, defaultItems?: DraggableItem[]): void {
    if (!this.containerItems.has(containerId)) {
      const items = defaultItems
        ? defaultItems.map(item => ({
            id: `${containerId}-${this.nextId++}`,
            icon: item.icon,
            text: item.text
          }))
        : [];

      this.containerItems.set(containerId, items);
      this.itemsSubject.next();
    }
  }

  getItemsForContainer(containerId: string): DraggableItem[] {
    return this.containerItems.get(containerId) || [];
  }

  hasItems(containerId: string): boolean {
    const items = this.containerItems.get(containerId);
    return items !== undefined && items.length > 0;
  }

  moveItem(elementId: string, targetContainerId: string, targetIndex: number = -1): void {
    let sourceContainerId: string | undefined;
    let sourceItem: DraggableItem | undefined;
    let sourceIndex: number = -1;

    // Znajdź element w kontenerze źródłowym
    for (const [containerId, items] of this.containerItems.entries()) {
      sourceIndex = items.findIndex(item => item.id === elementId);
      if (sourceIndex !== -1) {
        sourceContainerId = containerId;
        sourceItem = items[sourceIndex];
        break;
      }
    }

    // Jeśli znaleziono element
    if (sourceItem && sourceContainerId) {
      const sourceItems = this.containerItems.get(sourceContainerId);
      const targetItems = this.containerItems.get(targetContainerId);

      if (!sourceItems || !targetItems) return;

      // Jeśli kontenery są różne
      if (sourceContainerId !== targetContainerId) {
        // Usuń z kontenera źródłowego
        sourceItems.splice(sourceIndex, 1);
        // Jeśli targetIndex jest określony, wstaw element w odpowiednie miejsce
        if (targetIndex >= 0 && targetIndex <= targetItems.length) {
          targetItems.splice(targetIndex, 0, sourceItem);
        } else {
          // W przeciwnym razie dodaj na koniec
          targetItems.push(sourceItem);
        }
      } else {
        // W tym samym kontenerze - zmień kolejność
        if (targetIndex >= 0 && targetIndex < targetItems.length) {
          // Usuń z obecnej pozycji
          sourceItems.splice(sourceIndex, 1);
          // Wstaw na nową pozycję
          sourceItems.splice(targetIndex, 0, sourceItem);
        }
      }
      this.itemsSubject.next();
    }
  }

  deleteItem(elementId: string, containerId: string): void {
    const items = this.containerItems.get(containerId);
    if (items) {
      const index = items.findIndex(item => item.id === elementId);
      if (index !== -1) {
        items.splice(index, 1);
        this.itemsSubject.next();
      }
    }
  }

  clear(): void {
    this.containerItems.clear();
    this.itemsSubject.next();
  }
}
