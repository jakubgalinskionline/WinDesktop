import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

import { WindowModel } from '../../models/window/window.model';
import { WindowComponent } from '../window/window.component';
import { NotificationIconComponent } from '../notification-icon/notification-icon.component';
import { UserNavIconComponent } from '../user-nav-icon/user-nav-icon.component';
import { OpenWindowsListComponent } from '../open-windows-list/open-windows-list.component';
import { AgentComponent } from '../agent/agent.component';
import { MenuComponent } from '../menu/menu.component';

import { WindowService } from '../../services/window.service';
import { ThemeService } from '../../services/theme.service';

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
    ContextMenuComponent,
    MenuComponent
  ],
  providers: [ThemeService, WindowService],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css',
})
export class DesktopComponent implements OnInit {
  @ViewChild('contextMenu') contextMenu!: ContextMenuComponent;

  isDarkMode$: Observable<boolean>;
  windows$: Observable<WindowModel[]>;

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

  trackById(index: number, window: WindowModel): number {
    return window.id;
  }

  displayContextMenu(event: MouseEvent) {
    this.contextMenu.show(event);
  }
}
