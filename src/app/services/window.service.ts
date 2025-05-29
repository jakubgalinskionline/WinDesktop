import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WindowModel } from '../models/window.model';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private windows = new BehaviorSubject<WindowModel[]>([]);
  windows$ = this.windows.asObservable();
  private nextId = 1;

  openWindow(component: any, title: string) {
    const window: WindowModel = {
      id: this.nextId++,
      title,
      component,
      x: 100,
      y: 100,
      width: 500,
      height: 500,
      isMinimized: false,
      isMaximized: false,
      zIndex: this.getMaxZIndex() + 1
    };

    this.windows.next([...this.windows.getValue(), window]);
  }

  private getMaxZIndex(): number {
    const windows = this.windows.getValue();
    return windows.length ? Math.max(...windows.map(w => w.zIndex)) : 0;
  }

  closeWindow(id: number) {
    const windows = this.windows.getValue();
    this.windows.next(windows.filter(w => w.id !== id));
  }

  bringToFront(id: number) {
    const windows = this.windows.getValue();
    const maxZ = this.getMaxZIndex();
    this.windows.next(windows.map(w =>
      w.id === id ? {...w, zIndex: maxZ + 1} : w
    ));
  }
}
