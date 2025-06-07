import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { WindowService } from '../../services/window.service';
import { MenuItem } from '../../models/menu/menu-item.model';
import { CalculatorComponent } from '../calculator/calculator.component';
import { NotepadComponent } from '../notepad/notepad.component';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { DragAndDropComponent } from '../drag-and-drop/drag-and-drop.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  isDarkMode$: Observable<boolean>;

  menuItems: MenuItem[] = [
    {
      label: 'Pulpit',
      icon: 'ti ti-layout-dashboard',
      id: 'topnav-dashboards',
      action: () => {},
      children: [
        {
          label: 'Panel główny',
          icon: 'ti ti-home',
          action: () => this.openCalculator()
        },
        {
          label: 'Notatnik',
          icon: 'ti ti-pencil',
          action: () => this.openNotepad()
        },
        {
          label: 'Raporty',
          icon: 'ti ti-chart-pie',
          action: () => this.openCalculator()
        }
      ]
    },
    {
      label: 'Zarządzanie',
      icon: 'ti ti-settings',
      id: 'topnav-management',
      action: () => {},
      children: [
        {
          label: 'Użytkownicy',
          icon: 'ti ti-users',
          action: () => this.openNotepad()
        },
        {
          label: 'Uprawnienia',
          icon: 'ti ti-lock',
          action: () => this.openCalculator()
        },
        {
          label: 'Ustawienia',
          icon: 'ti ti-settings',
          action: () => this.openNotepad()
        }
      ]
    },    {
      label: 'Dokumenty',
      icon: 'bi bi-folder2-open',
      id: 'topnav-documents',
      action: () => {},
      children: [
        {
          label: 'Faktury',
          icon: 'ti ti-file-invoice',
          action: () => this.openCalculator()
        },
        {
          label: 'Zamówienia',
          icon: 'ti ti-shopping-cart',
          action: () => this.openNotepad()
        },
        {
          label: 'Umowy',
          icon: 'ti ti-file-contract',
          action: () => this.openCalculator()
        }
      ]
    },
    {      label: 'Raporty',
      icon: 'bi bi-bar-chart',
      id: 'topnav-reports',
      action: () => {},
      children: [        {
          label: 'Raporty sprzedaży',
          icon: 'bi bi-graph-up-arrow',
          action: () => {},
          children: [
            {
              label: 'Dzienny',
              icon: 'bi bi-calendar-day',
              action: () => this.openCalculator()
            },
            {
              label: 'Miesięczny',
              icon: 'bi bi-calendar-month',
              action: () => this.openCalculator()
            },
            {
              label: 'Roczny',
              icon: 'bi bi-calendar-check',
              action: () => this.openCalculator()
            }
          ]
        },
        {          label: 'Analityka',
          icon: 'bi bi-graph-up',
          action: () => this.openNotepad()
        },
        {
          label: 'Otwórz 2 okna',
          icon: 'bi bi-window-stack',
          action: () => this.openTwoWindows()
        },
        {
          label: 'Drag-and-Drop',
          icon: 'bi bi-window-stack',
          action: () => this.openDraggableWindows()
        }
      ]
    }
  ];

  constructor(
    private windowService: WindowService,
    private themeService: ThemeService
  ) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit() {
    // Inicjalizacja komponentu
  }


  // Okno z przeciągalną zawartością
  // this.windowService.openWindow(CalculatorComponent, "Kalkulator", 100, 100, 400, 300, true);

  // Okno bez możliwości przeciągania zawartości
  // this.windowService.openWindow(NotePadComponent, "Notatnik", 200, 200, 400, 300, false);

  openNotepad() {
    this.windowService.openWindow(
      NotepadComponent,
      'Notatnik',
      Math.random() * (window.innerWidth - 400),
      Math.random() * (window.innerHeight - 400),
      600,
      400,
      false,
      { // dane wejściowe dla komponentu
        defaultContent: '',
        maxLength: 50000
      },
      { // obsługa zdarzeń z komponentu
        onContentChange: (content: string) => {
          console.log('Zmiana zawartości notatnika:', content);
        },
        onSave: (fileName: string) => {
          console.log('Zapisano plik:', fileName);
        }
      }
    );
  }

  openCalculator() {
    this.windowService.openWindow(CalculatorComponent, 'Kalkulator',
      Math.random() * (window.innerWidth - 600), // losowa pozycja x
      Math.random() * (window.innerHeight - 600), // losowa pozycja y
      600, 600, false);
  }

  openTwoWindows() {
    this.windowService.openWindow(NotepadComponent, 'Notatnik',
      Math.random() * (window.innerWidth - 400), // losowa pozycja x
      Math.random() * (window.innerHeight - 400), // losowa pozycja y
      400, 400, false);
    this.windowService.openWindow(CalculatorComponent, 'Kalkulator',
      Math.random() * (window.innerWidth - 600), // losowa pozycja x
      Math.random() * (window.innerHeight - 600), // losowa pozycja y
      600, 600, false);
  }

  openDraggableWindows() {
    this.windowService.openWindow(DragAndDropComponent, 'Drag-and-Drop',
      Math.random() * (window.innerWidth - 600), // losowa pozycja x
      Math.random() * (window.innerHeight - 600), // losowa pozycja y
      600, 600, true);
    this.windowService.openWindow(DragAndDropComponent, 'Drag-and-Drop',
      Math.random() * (window.innerWidth - 600), // losowa pozycja x
      Math.random() * (window.innerHeight - 600), // losowa pozycja y
      600, 600, true);
  }

}
