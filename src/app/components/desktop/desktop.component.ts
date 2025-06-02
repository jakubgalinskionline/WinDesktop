import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// obsługa okna
import { WindowComponent } from '../window/window.component';
import { WindowService } from '../../services/window.service';
// obsługa tematu - jasny/ciemny
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
export class DesktopComponent {
  Windows$: typeof this.WindowService.Windows$;
  isDarkMode$;

  constructor(private WindowService: WindowService, private themeService: ThemeService) {
    this.Windows$ = this.WindowService.Windows$;
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }


  OpenNotepad() {
    this.WindowService.OpenWindow(NotepadComponent, 'Notatnik', 50, 150, 400, 400);
  }

  OpenCalculator() {
    this.WindowService.OpenWindow(CalculatorComponent, 'Kalkulator', 150, 200, 600, 600);
  }
}
