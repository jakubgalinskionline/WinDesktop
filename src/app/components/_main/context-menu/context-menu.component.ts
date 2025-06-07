import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';
import { ContextMenuItem } from './models/context-menu-item.model';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent {
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
