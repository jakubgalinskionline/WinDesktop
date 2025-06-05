import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { RightClickContextMenuComponent } from '../right-click-context-menu/right-click-context-menu.component';

import { WindowModel } from '../../models/window/window.model';
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

  windows$: Observable<WindowModel[]>;
  isDarkMode$: Observable<boolean>;

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
