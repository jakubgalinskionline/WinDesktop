import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { RightClickContextMenuComponent } from '../right-click-context-menu/right-click-context-menu.component';

import { WindowModel } from '../../models/window/window.model';
import { MenuItem } from '../../models/menu/menu-item.model';

import { WindowComponent } from '../window/window.component';
import { NotificationIconComponent } from '../notification-icon/notification-icon.component';
import { UserNavIconComponent } from '../user-nav-icon/user-nav-icon.component';
import { OpenWindowsListComponent } from '../open-windows-list/open-windows-list.component';
import { AgentComponent } from '../agent/agent.component';

import { WindowService } from '../../services/window.service';
import { ThemeService } from '../../services/theme.service';

import { CalculatorComponent } from '../calculator/calculator.component';
import { NotepadComponent } from '../notepad/notepad.component';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    WindowComponent,
    UserNavIconComponent,
    NotificationIconComponent,
    AgentComponent,
    OpenWindowsListComponent,
    RightClickContextMenuComponent
],
  providers: [ThemeService, WindowService],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.scss',
})
export class DesktopComponent implements OnInit {
  @ViewChild('contextMenu') contextMenu!: RightClickContextMenuComponent;

  isDarkMode$: Observable<boolean>;
  windows$: Observable<WindowModel[]>;

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
    },
    {
      label: 'Dokumenty',
      icon: 'ti ti-files',
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
    {
      label: 'Raporty',
      icon: 'ti ti-chart-bar',
      id: 'topnav-reports',
      action: () => {},
      children: [        {
          label: 'Raporty sprzedaży',
          icon: 'ti ti-report-money',
          action: () => {},
          children: [
            {
              label: 'Dzienny',
              icon: 'ti ti-calendar-day',
              action: () => this.openCalculator()
            },
            {
              label: 'Miesięczny',
              icon: 'ti ti-calendar-month',
              action: () => this.openCalculator()
            },
            {
              label: 'Roczny',
              icon: 'ti ti-calendar-year',
              action: () => this.openCalculator()
            }
          ]
        },
        {
          label: 'Raporty finansowe',
          icon: 'ti ti-report',
          action: () => this.openCalculator()
        },
        {
          label: 'Analityka',
          icon: 'ti ti-chart-dots',
          action: () => this.openNotepad()
        },
        {
          label: 'Otwórz 2 okna',
          icon: 'ti ti-messages',
          action: () => this.openTwoWindows()
        }
      ]
    }
  ];

  constructor(
    private windowService: WindowService,
    private themeService: ThemeService
  ) {
    this.windows$ = this.windowService.windows$;
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit() {
    // Inicjalizacja komponentu
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
  openNotepad() {
    this.windowService.openWindow(NotepadComponent, 'Notatnik',
      Math.random() * (window.innerWidth - 400), // losowa pozycja x
      Math.random() * (window.innerHeight - 400), // losowa pozycja y
      400, 400);
  }

  openCalculator() {
    this.windowService.openWindow(CalculatorComponent, 'Kalkulator',
      Math.random() * (window.innerWidth - 600), // losowa pozycja x
      Math.random() * (window.innerHeight - 600), // losowa pozycja y
      600, 600);
  }  openTwoWindows() {
    this.openNotepad();
    this.openCalculator();
  }

  trackById(index: number, window: WindowModel): number {
    return window.id;
  }  displayContextMenu(event: MouseEvent) {
    this.contextMenu.show(event);
  }
}
