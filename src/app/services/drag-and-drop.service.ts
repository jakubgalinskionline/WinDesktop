import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DraggableItem {
  id: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {
  // Stan aplikacji przechowywany w Map, gdzie kluczem jest ID kontenera
  private containerItems = new Map<string, DraggableItem[]>();
  private itemsSubject = new BehaviorSubject<void>(undefined);
  items$ = this.itemsSubject.asObservable();
  private nextId = 1;
  private initialized = false;

  private static readonly DEFAULT_ITEMS = [
    { text: 'Element 1' },
    { text: 'Element 2' },
    { text: 'Element 3' },
    { text: 'Element 4' },
    { text: 'Element 5' },
    { text: 'Element 6' },
    { text: 'Element 7' },
    { text: 'Element 8' },
    { text: 'Element 9' },
    { text: 'Element 10' },
    { text: 'Element 11' },
    { text: 'Element 12' },
    { text: 'Element 12' },
    { text: 'Element 14' },
  ];

  constructor() {}

  // Inicjalizacja elementów dla danego kontenera
  initializeItems(containerId: string): void {
    if (!this.containerItems.has(containerId)) {
      // Tylko pierwszy kontener dostaje domyślne elementy
      const items = this.initialized ? [] : DragAndDropService.DEFAULT_ITEMS.map(item => ({
        id: `${containerId}-${this.nextId++}`,
        text: item.text
      }));

      this.containerItems.set(containerId, items);
      if (!this.initialized) {
        this.initialized = true;
      }
      this.itemsSubject.next();
    }
  }

  // Pobranie elementów dla danego kontenera
  getItemsForContainer(containerId: string): DraggableItem[] {
    return this.containerItems.get(containerId) || [];
  }

  // Sprawdzenie czy kontener ma elementy
  hasItems(containerId: string): boolean {
    const items = this.containerItems.get(containerId);
    return items !== undefined && items.length > 0;
  }

  // Przeniesienie elementu między kontenerami
  moveItem(elementId: string, targetContainerId: string, targetIndex: number = -1): void {
    // Znajdź kontener źródłowy i element
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

  // Usunięcie elementu z kontenera
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

  // Wyczyszczenie wszystkich elementów
  clear(): void {
    this.containerItems.clear();
    this.itemsSubject.next();
  }
}
