import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';

// obsługa okna
import { WindowComponent } from '../window/window.component';
import { WindowService } from '../../services/window.service';
// obsługa tematu - jasny/cie
import { ThemeService } from './../../services/theme.service';

import { NotepadComponent } from '../notepad/notepad.component';
import { CalculatorComponent } from '../calculator/calculator.component';
import { FooterComponent } from "../footer/footer.component";

import { NotificationIconComponent } from '../notification-icon/notification-icon.component';
import { UserNavIconComponent } from '../user-nav-icon/user-nav-icon.component';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, WindowComponent, FooterComponent, UserNavIconComponent, NotificationIconComponent],
  providers: [ThemeService],
  templateUrl: `./desktop.component.html`,
  styleUrl: `./desktop.component.scss`,
})
export class DesktopComponent implements OnInit {
  windows$: typeof this.windowService.Windows$;
  @Input() isDarkMode$: typeof this.themeService.darkMode$;

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
}
