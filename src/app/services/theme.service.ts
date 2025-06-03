import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    // Sprawdź zapisany motyw w localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.darkMode.next(savedTheme === 'dark');
    } else {
      // Sprawdź preferencje systemowe
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode.next(prefersDark);
    }
  }

  toggleTheme(): void {
    const newValue = !this.darkMode.getValue();
    this.darkMode.next(newValue);
    // Zapisz wybór w localStorage
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  getCurrentTheme(): boolean {
    return this.darkMode.getValue();
  }
}
