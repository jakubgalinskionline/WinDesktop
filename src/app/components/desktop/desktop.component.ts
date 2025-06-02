import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../window/window.component';
import { WindowService } from '../../services/window.service';
import { NotepadComponent } from '../notepad/notepad.component';
import { CalculatorComponent } from '../calculator/calculator.component';
import { FooterComponent } from "../footer/footer.component";

import { NotificationIconComponent } from '../notification-icon/notification-icon.component';
import { UserNavIconComponent } from '../user-nav-icon/user-nav-icon.component';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, WindowComponent, FooterComponent, UserNavIconComponent, NotificationIconComponent],
  templateUrl: `./desktop.component.html`,
  styleUrl: `./desktop.component.scss`,
})
export class DesktopComponent {
  Windows$: typeof this.WindowService.Windows$;

  constructor(private WindowService: WindowService) {
    this.Windows$ = this.WindowService.Windows$;
  }

  openNotepad() {
    this.WindowService.OpenWindow(NotepadComponent, 'Notatnik', 50, 150, 400, 400);
  }

  openCalculator() {
    this.WindowService.OpenWindow(CalculatorComponent, 'Kalkulator', 150, 200, 600, 600);
  }
}
