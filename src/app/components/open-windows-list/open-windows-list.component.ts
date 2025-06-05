import { Component, Input, ChangeDetectionStrategy, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowModel } from '../../models/window/window.model';
import { WindowService } from '../../services/window.service';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-open-windows-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './open-windows-list.component.html',
  styleUrls: ['./open-windows-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenWindowsListComponent {
  @Input() windows: WindowModel[] = [];
  isListVisible = false;
  isDarkMode$: Observable<boolean>;
  constructor(
    private themeService: ThemeService,
    private windowService: WindowService,
    private elementRef: ElementRef
  ) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Sprawdzamy czy kliknięcie było poza komponentem
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isListVisible = false;
    }
  }

  trackById(index: number, window: WindowModel): number {
    return window.id;
  }

  toggleList() {
    this.isListVisible = !this.isListVisible;
  }

  minimizeWindow(window: WindowModel, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    if (window.isMinimized) {
      this.windowService.restoreWindow(window.id);
    } else {
      this.windowService.minimizeWindow(window.id);
    }
    this.windowService.bringToFront(window.id);
  }

  maximizeWindow(window: WindowModel, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    if (window.isMaximized) {
      this.windowService.restoreWindow(window.id);
    } else {
      this.windowService.maximizeWindow(window.id);
    }
    this.windowService.bringToFront(window.id);
  }

  bringToFront(window: WindowModel, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.windowService.bringToFront(window.id);
  }

  closeWindow(id: number, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.windowService.closeWindow(id);
    if (this.windows.length === 1) {
      this.isListVisible = false;
    }
  }
}
