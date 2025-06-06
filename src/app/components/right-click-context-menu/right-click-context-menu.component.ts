import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

import { ContextMenuItem } from './models/context-menu-item.model';

@Component({
  selector: 'right-click-context-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isVisible"
      class="context-menu"
      [style.left.px]="x"
      [style.top.px]="y"
    >
      <div
        *ngFor="let item of menuItems"
        class="context-menu-item"
        [class.disabled]="item.disabled"
        [class.separator]="item.separator"
        [class.has-submenu]="item.children?.length"
        (click)="onItemClick(item)"
        (mouseenter)="onItemHover(item, $event)"
      >
        <i *ngIf="item.icon" [class]="item.icon"></i>
        <span>{{ item.label }}</span>
        <i *ngIf="item.children?.length" class="bi bi-chevron-right submenu-arrow"></i>
      </div>
    </div>

    <!-- Podmenu -->
    <div
      *ngIf="activeSubmenu"
      class="context-menu submenu"
      [style.left.px]="submenuX"
      [style.top.px]="submenuY"
    >
      <div
        *ngFor="let item of activeSubmenu"
        class="context-menu-item"
        [class.disabled]="item.disabled"
        [class.separator]="item.separator"
        (click)="onItemClick(item)"
      >
        <i *ngIf="item.icon" [class]="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
    </div>
  `,
  styles: [`
    .context-menu {
      position: fixed;
      background: var(--bs-white);
      border: 1px solid var(--bs-border-color);
      border-radius: 4px;
      padding: 4px 0;
      min-width: 180px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 9999;
    }

    .context-menu-item {
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      color: var(--bs-body-color);
      transition: background-color 0.2s;
      position: relative;
    }

    .context-menu-item:hover {
      background-color: var(--bs-gray-100);
    }

    .context-menu-item.separator {
      border-top: 1px solid var(--bs-border-color);
      margin: 4px 0;
      cursor: default;
      pointer-events: none;
    }

    .context-menu-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .submenu-arrow {
      margin-left: auto;
      font-size: 12px;
    }

    .context-menu.submenu {
      position: fixed;
    }

    [data-theme="dark"] .context-menu {
      background: var(--bs-dark);
      border-color: var(--bs-gray-700);
    }

    [data-theme="dark"] .context-menu-item:hover {
      background-color: var(--bs-gray-800);
    }
  `]
})
export class RightClickContextMenuComponent {
  isDarkMode$: Observable<boolean>;

  constructor(
    private elementRef: ElementRef,
    private themeService: ThemeService
  ) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  @Input() menuItems: ContextMenuItem[] = [
    {
      label: 'Nowy',
      icon: 'bi bi-plus-lg',
      action: () => {}, // Dodajemy pustą akcję dla elementu z children
      children: [
        {
          label: 'Folder',
          icon: 'bi bi-folder',
          action: () => console.log('Nowy folder')
        },
        {
          label: 'Plik tekstowy',
          icon: 'bi bi-file-text',
          action: () => console.log('Nowy plik tekstowy')
        },
        {
          separator: true,
          label: '',
          action: () => {}
        },
        {
          label: 'Skrót',
          icon: 'bi bi-link-45deg',
          action: () => console.log('Nowy skrót')
        }
      ]
    },
    {
      separator: true,
      label: '',
      action: () => {}
    },
    {
      label: 'Kopiuj',
      icon: 'bi bi-files',
      action: () => console.log('Kopiuj')
    },
    {
      label: 'Wklej',
      icon: 'bi bi-clipboard',
      action: () => console.log('Wklej')
    },
    {
      separator: true,
      label: '',
      action: () => {}
    },
    {
      label: 'Personalizuj',
      icon: 'bi bi-palette',
      action: () => console.log('Personalizuj')
    }
  ];

  isVisible = false;
  x = 0;
  y = 0;

  // Obsługa podmenu
  activeSubmenu: ContextMenuItem[] | null = null;
  submenuX = 0;
  submenuY = 0;

  show(event: MouseEvent) {
    event.preventDefault();

    // Sprawdzamy granice ekranu
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = 180; // Szerokość menu
    const menuHeight = 200; // Przybliżona wysokość menu

    // Obliczamy pozycję, aby menu nie wychodziło poza ekran
    this.x = Math.min(event.clientX, viewportWidth - menuWidth);
    this.y = Math.min(event.clientY, viewportHeight - menuHeight);

    this.isVisible = true;
    this.activeSubmenu = null;
  }

  hide() {
    this.isVisible = false;
    this.activeSubmenu = null;
  }

  onItemClick(item: ContextMenuItem) {
    if (item.disabled || item.separator) return;
    if (item.children?.length) return; // Nie zamykamy menu jeśli kliknięto element z podmenu

    item.action();
    this.hide();
  }

  onItemHover(item: ContextMenuItem, event: MouseEvent) {
    if (item.children?.length) {
      const itemElement = event.currentTarget as HTMLElement;
      const rect = itemElement.getBoundingClientRect();

      // Sprawdzamy granice ekranu dla podmenu
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const submenuWidth = 180;

      // Domyślnie pokazujemy podmenu po prawej stronie
      let x = rect.right;
      let y = rect.top;

      // Jeśli podmenu wyjdzie poza prawy brzeg ekranu, pokazujemy je po lewej stronie
      if (x + submenuWidth > viewportWidth) {
        x = rect.left - submenuWidth;
      }

      this.submenuX = x;
      this.submenuY = y;
      this.activeSubmenu = item.children;
    } else {
      this.activeSubmenu = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.hide();
  }
}
