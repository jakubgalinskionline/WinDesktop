import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WindowModel } from '../models/window.model';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private Windows = new BehaviorSubject<WindowModel[]>([]);
  Windows$ = this.Windows.asObservable();
  private nextId = 1;

  OpenWindow(component: any, title: string, x: number, y: number, w: number, h: number) {
    const Window: WindowModel = {
      id: this.nextId++,
      title,
      component,
      x: x,
      y: y,
      width: w,
      height: h,
      isMinimized: false,
      isMaximized: false,
      zIndex: this.getMaxZIndex() + 1,
      isActive: true
    };

    this.Windows.next([...this.Windows.getValue(), Window]);
  }

  private getMaxZIndex(): number {
    const Windows = this.Windows.getValue();
    return Windows.length ? Math.max(...Windows.map(w => w.zIndex)) : 0;
  }

  MaximizeWindow(id: number) {
    const Windows = this.Windows.getValue();
    const screenBounds = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.Windows.next(Windows.map(w =>
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

  CloseWindow(id: number) {
    const Windows = this.Windows.getValue();
    this.Windows.next(Windows.filter(w => w.id !== id));
  }

  BringToFront(id: number) {
    const Windows = this.Windows.getValue();
    const maxZ = this.getMaxZIndex();
    this.Windows.next(Windows.map(w =>
      w.id === id ? {...w, zIndex: maxZ + 1} : w
    ));
  }
}
