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

  openWindow(component: any, title: string, w: any, h: any) {
    const window: WindowModel = {
      id: this.nextId++,
      title,
      component,
      x: 100,
      y: 100,
      width: w,
      height: h,
      isMinimized: false,
      isMaximized: false,
      zIndex: this.getMaxZIndex() + 1,
      isActive: true
    };

    this.windows.next([...this.windows.getValue(), window]);
  }

  private getMaxZIndex(): number {
    const windows = this.windows.getValue();
    return windows.length ? Math.max(...windows.map(w => w.zIndex)) : 0;
  }

  maximizeWindow(id: number) {
    const windows = this.windows.getValue();
    const screenBounds = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.windows.next(windows.map(w =>
      w.id === id ? {
        ...w,
        isMaximized: true,
        x: 0,
        y: 0,
        width: screenBounds.width,
        height: screenBounds.height - 40, // Adjust for taskbar height
        isActive: true
      } : {...w, isMaximized: false}
    ));
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
