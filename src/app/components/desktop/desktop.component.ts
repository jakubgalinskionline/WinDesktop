import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../window/window.component';
import { WindowService } from '../../services/window.service';
import { NotepadComponent } from '../notepad/notepad.component';
import { CalculatorComponent } from '../calculator/calculator.component';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  templateUrl: `./desktop.component.html`,
  styleUrl: `./desktop.component.css`,
})
export class DesktopComponent {
  windows$: typeof this.windowService.windows$;

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
