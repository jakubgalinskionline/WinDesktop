import { Injectable, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WindowModel } from '../models/window.model';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private Windows = new BehaviorSubject<WindowModel[]>([]);
  Windows$ = this.Windows.asObservable();
  private nextId = 1;

constructor(private themeService: ThemeService) {
  // Inicjalizacja początkowego stanu
  this.currentTheme = this.themeService.getCurrentTheme();

  // Nasłuchuj zmian motywu
  this.themeService.darkMode$.subscribe(isDark => {
    this.currentTheme = isDark;
    this.updateWindowsTheme();
  });
}

 private currentTheme: boolean;

  private getCurrentTheme(): boolean {
    return this.currentTheme;
  }

  private updateWindowsTheme(): void {
    const windows = this.Windows.getValue();
    if (windows.length > 0) {
      const updatedWindows = windows.map(window => ({
        ...window,
        isDarkMode: this.getCurrentTheme()
      }));
      this.Windows.next(updatedWindows);
    }
  }

  OpenWindow(component: any, title: string, x: number, y: number, w: number, h: number) {
    const Window: WindowModel = {
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
      isDarkMode: this.getCurrentTheme()
    };

    this.Windows.next([...this.Windows.getValue(), Window]);
    this.BringToFront(Window.id);
  }

  private updateWindow(id: number, updates: Partial<WindowModel>): void {
    const windows = this.Windows.getValue();
    this.Windows.next(windows.map(w =>
      w.id === id ? { ...w, ...updates, isDarkMode: this.getCurrentTheme() } : w
    ));
  }

  private getMaxZIndex(): number {
    const windows = this.Windows.getValue();
    return windows.length > 0
      ? Math.max(...windows.map(w => w.zIndex))
      : 0;
  }

  BringToFront(id: number) {
    const windows = this.Windows.getValue();
    const maxZ = this.getMaxZIndex();
    this.Windows.next(windows.map(w =>
      w.id === id ? { ...w, zIndex: maxZ + 1, isActive: true } : { ...w, isActive: false }
    ));
  }

  MaximizeWindow(id: number) {
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

  MinimizeWindow(id: number) {
    this.updateWindow(id, {
      isMinimized: true
    });
  }

  RestoreWindow(id: number) {
    this.updateWindow(id, {
      isMinimized: false,
      isMaximized: false
    });
  }

  CloseWindow(id: number) {
    const Windows = this.Windows.getValue();
    this.Windows.next(Windows.filter(w => w.id !== id));
  }
}
