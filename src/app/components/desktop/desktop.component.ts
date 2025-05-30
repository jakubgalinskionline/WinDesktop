import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../window/window.component';
import { WindowService } from '../../services/window.service';
import { NotepadComponent } from '../notepad/notepad.component';
import { CalculatorComponent } from '../calculator/calculator.component';
import { FooterComponent } from "../footer/footer.component";

import { NotificationIconComponent } from '../notification-icon/notification-icon.component';
import { UserNavIconComponent } from '../user-nav-icon/user-nav-icon.component';
import { WebContext } from '../../models/WebContext';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, WindowComponent, FooterComponent],
  // UserNavIconComponent, NotificationIconComponent
  templateUrl: `./desktop.component.html`,
  styleUrl: `./desktop.component.scss`,
})
export class DesktopComponent {
  windows$: typeof this.windowService.windows$;
  // webContext: WebContext = {} as WebContext;

  constructor(private windowService: WindowService) {
    this.windows$ = this.windowService.windows$;
  }

  openNotepad() {
    this.windowService.openWindow(NotepadComponent, 'Notatnik');
  }

  openCalculator() {
    this.windowService.openWindow(CalculatorComponent, 'Kalkulator');
  }
}
