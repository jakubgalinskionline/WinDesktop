import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Sprawdź zapisany motyw w localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.darkModeSubject.next(savedTheme === 'dark');
    } else {
      // Sprawdź preferencje systemowe
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkModeSubject.next(prefersDark);
    }
  }

  toggleDarkMode() {
    this.darkModeSubject.next(!this.darkModeSubject.getValue());
  }

  getCurrentTheme(): boolean {
    return this.darkModeSubject.getValue();
  }
}
