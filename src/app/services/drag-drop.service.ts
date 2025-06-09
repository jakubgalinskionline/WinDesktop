import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DraggableItem {
  id: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  // Stan aplikacji przechowywany w Map, gdzie kluczem jest ID kontenera
  private containerItems = new Map<string, DraggableItem[]>();
  private itemsSubject = new BehaviorSubject<void>(undefined);
  items$ = this.itemsSubject.asObservable();
  private nextId = 1;
  private initialized = false;

  private static readonly DEFAULT_ITEMS = [
    { text: 'Element 1' },
    { text: 'Element 2' },
    { text: 'Element 3' }
  ];

  constructor() {}

  // Inicjalizacja elementów dla danego kontenera
  initializeItems(containerId: string): void {
    if (!this.containerItems.has(containerId)) {
      // Tylko pierwszy kontener dostaje domyślne elementy
      const items = this.initialized ? [] : DragDropService.DEFAULT_ITEMS.map(item => ({
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
  moveItem(elementId: string, targetContainerId: string): void {
    // Znajdź kontener źródłowy i element
    let sourceContainerId: string | undefined;
    let movedItem: DraggableItem | undefined;

    // Znajdź element w kontenerze źródłowym
    for (const [containerId, items] of this.containerItems.entries()) {
      const itemIndex = items.findIndex(item => item.id === elementId);
      if (itemIndex !== -1) {
        sourceContainerId = containerId;
        // Usuń element z kontenera źródłowego
        movedItem = items.splice(itemIndex, 1)[0];
        break;
      }
    }

    // Jeśli znaleziono element i kontenery są różne
    if (movedItem && sourceContainerId !== targetContainerId) {
      // Pobierz tablicę elementów kontenera docelowego
      const targetItems = this.containerItems.get(targetContainerId) || [];
      // Przenieś element do kontenera docelowego zachowując jego id
      targetItems.push(movedItem);
      this.containerItems.set(targetContainerId, targetItems);
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
