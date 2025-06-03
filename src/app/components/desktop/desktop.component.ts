import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// okno
import { WindowComponent } from '../window/window.component';
import { WindowService } from '../../services/window.service';
import { ThemeService } from './../../services/theme.service';
import { NotificationIconComponent } from '../notification-icon/notification-icon.component';
import { UserNavIconComponent } from '../user-nav-icon/user-nav-icon.component';
import { FooterComponent } from "../footer/footer.component";
// komponenty
import { NotepadComponent } from '../notepad/notepad.component';
import { CalculatorComponent } from '../calculator/calculator.component';
import { ChatComponent } from '../chat/chat.component';

import { AgentComponent } from '../agent/agent.component';
@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, WindowComponent, FooterComponent, UserNavIconComponent, NotificationIconComponent, AgentComponent],
  providers: [ThemeService],
  templateUrl: `./desktop.component.html`,
  styleUrl: `./desktop.component.scss`,
})
export class DesktopComponent implements OnInit {
  windows$: typeof this.windowService.Windows$;
  @Input() isDarkMode$: Observable<boolean>;

  constructor(private windowService: WindowService, private themeService: ThemeService) {
    this.windows$ = this.windowService.Windows$;
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit() {
    // Subskrybuj zmiany motywu i aktualizuj okna
    this.isDarkMode$.subscribe(isDark => {
      this.windows$.pipe(take(1)).subscribe((windows: any[]) => {
        windows.forEach(window => {
          window.isDarkMode = isDark;
        });
      });
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  OpenNotepad() {
    this.windowService.OpenWindow(NotepadComponent, 'Notatnik', 50, 150, 400, 400);
  }
  OpenCalculator() {
    this.windowService.OpenWindow(CalculatorComponent, 'Kalkulator', 150, 200, 600, 600);
  }

  OpenChat() {
    // Otwórz pierwsze okno czatu
    this.windowService.OpenWindow(ChatComponent, 'Chat 1', 50, 50, 400, 500);
    // Otwórz drugie okno czatu obok
    this.windowService.OpenWindow(ChatComponent, 'Chat 2', 500, 50, 400, 500);
  }
}
