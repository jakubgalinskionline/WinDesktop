import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowService } from '../../../services/window.service';
import { MenuItem } from '../../../models/menu/menu-item.model';
import { CalculatorComponent } from '../../../components/calculator/calculator.component';
import { NotepadComponent } from '../../../components/notepad/notepad.component';
import { ThemeService } from '../../../services/theme.service';
import { DragAndDropComponent } from '../../../components/drag-and-drop/drag-and-drop.component';
import { DualContainerComponent } from '../../../components/dual-container/dual-container.component';
import { Observable } from 'rxjs';
import { DraggableItem } from '../../../services/drag-and-drop.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
})
export class MainMenuComponent implements OnInit {
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
      children: [        {          label: 'Raporty sprzedaży',
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
            },
          ]
        },
        {
          label: 'Analityka',
          icon: 'bi bi-graph-up',
          action: () => this.openNotepad()
        },
        {
          label: 'Otwórz 2 okna',
          icon: 'bi bi-window-stack',
          action: () => this.openTwoWindows()
        },
        {
          label: 'Drag-and-Drop 2 kontenery',
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


  // openDraggableWindows()
  private readonly DRAGGABLE_WINDOW_ITEMS: DraggableItem[] = [
    { id: 'default-1', icon: 'bi bi-pc-display', text: 'Mój komputer' },
    { id: 'default-2', icon: 'bi bi-folder', text: 'Moje dokumenty' },
    { id: 'default-3', icon: 'bi bi-diagram-3', text: 'Sieć' },
    { id: 'default-4', icon: 'bi bi-download', text: 'Pobrane' },
    { id: 'default-5', icon: 'bi bi-images', text: 'Obrazy' },
    { id: 'default-6', icon: 'bi bi-file-music', text: 'Muzyka' },
    { id: 'default-7', icon: 'bi bi-camera-video', text: 'Wideo' },
    { id: 'default-8', icon: 'bi bi-trash', text: 'Kosz' },
    { id: 'default-9', icon: 'bi bi-cloud', text: 'Chmura' },
    { id: 'default-10', icon: 'bi bi-star', text: 'Ulubione' },
    { id: 'default-11', icon: 'bi bi-archive', text: 'Archiwum' },
    { id: 'default-12', icon: 'bi bi-gear', text: 'Ustawienia' },
    { id: 'default-13', icon: 'bi bi-person', text: 'Użytkownik' },
    { id: 'default-14', icon: 'bi bi-shield-lock', text: 'Zabezpieczenia' }
  ];
  openDraggableWindows() {
    // Otwórz okno z dwoma kontenerami
    this.windowService.openWindow(DualContainerComponent, 'Drag-and-Drop (2 kontenery)',
      Math.random() * (window.innerWidth - 800),
      Math.random() * (window.innerHeight - 400),
      800, 400, true,
      { items: this.DRAGGABLE_WINDOW_ITEMS }
    );

    // Otwórz dwa osobne okna z kontenerami
    this.windowService.openWindow(DragAndDropComponent, 'Drag-and-Drop (Okno 1)',
      Math.random() * (window.innerWidth - 400),
      Math.random() * (window.innerHeight - 400),
      400, 400, true,
      { containerId: 'window-1', isDraggable: true }
    );
    this.windowService.openWindow(DragAndDropComponent, 'Drag-and-Drop (Okno 2)',
      Math.random() * (window.innerWidth - 400),
      Math.random() * (window.innerHeight - 400),
      400, 400, true,
      { containerId: 'window-2', isDraggable: true }
    );
  }
  // openDraggableWindows()

}
