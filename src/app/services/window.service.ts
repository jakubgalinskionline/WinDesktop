import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { WindowModel } from '../models/window/window.model';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class WindowService {  private windowsSubject = new BehaviorSubject<WindowModel[]>([]);
  windows$ = this.windowsSubject.asObservable();
  private nextId = 1;



constructor(private themeService: ThemeService) {
  // Inicjalizacja początkowego stanu
  this.currentTheme = this.themeService.getCurrentTheme();

  // Nasłuchuj zmian motywu z buforowaniem
  this.themeService.darkMode$.pipe(
    distinctUntilChanged() // aktualizuj tylko gdy wartość faktycznie się zmienia
  ).subscribe(isDark => {
    this.currentTheme = isDark;
    this.updateWindowsTheme();
  });
}

 private currentTheme: boolean;

  private getCurrentTheme(): boolean {
    return this.currentTheme;
  }
  private updateWindowsTheme(): void {
    const windows = this.windowsSubject.getValue();
    if (windows.length > 0) {
      const updatedWindows = windows.map((window: WindowModel) => ({
        ...window,
        themeMode: this.getCurrentTheme()
      }));
      this.windowsSubject.next(updatedWindows);
    }
  }

  openWindow(component: any, title: string, x: number, y: number, w: number, h: number) {
    const window: WindowModel = {
      id: this.nextId++,
      title,
      component,
      x, y,
      width: w,
      height: h,
      isMinimized: false,
      isMaximized: false,
      zIndex: this.getMaxZIndex() + 1,
      isActive: true,
      themeMode: this.getCurrentTheme()
    };

    this.windowsSubject.next([...this.windowsSubject.getValue(), window]);
    this.bringToFront(window.id);
  }

  private updateWindow(id: number, updates: Partial<WindowModel>): void {
    const windows = this.windowsSubject.getValue();
    this.windowsSubject.next(windows.map((w: WindowModel) =>
      w.id === id ? { ...w, ...updates, themeMode: this.getCurrentTheme() } : w
    ));
  }
  private getMaxZIndex(): number {
    const windows = this.windowsSubject.getValue();
    return windows.length > 0
      ? Math.max(...windows.map((w: WindowModel) => w.zIndex))
      : 0;
  }

  bringToFront(id: number) {
    const windows = this.windowsSubject.getValue();
    const maxZ = this.getMaxZIndex();
    this.windowsSubject.next(windows.map((w: WindowModel) =>
      w.id === id ? { ...w, zIndex: maxZ + 1, isActive: true } : { ...w, isActive: false }
    ));
  }

  maximizeWindow(id: number) {
    const screenBounds = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.updateWindow(id, {
      isMaximized: true,
      x: 0,
      y: 0,
      width: screenBounds.width,
      height: screenBounds.height - 40,
      isActive: true
    });
  }

  minimizeWindow(id: number) {
    this.updateWindow(id, {
      isMinimized: true
    });
  }

  restoreWindow(id: number) {
    this.updateWindow(id, {
      isMinimized: false,
      isMaximized: false
    });
  }
  closeWindow(id: number) {
    const windows = this.windowsSubject.getValue();
    this.windowsSubject.next(windows.filter((w: WindowModel) => w.id !== id));
  }
}
