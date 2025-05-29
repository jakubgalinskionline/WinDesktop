import { Component } from '@angular/core';
import { WindowService } from '../../services/window.service';
import { WindowComponent } from "../window/window.component";
import { CalculatorComponent } from '../calculator/calculator.component';
import { NotepadComponent } from '../notepad/notepad.component';

@Component({
  selector: 'app-desktop',
  template: `
    <div class="desktop">
      <div class="taskbar">
        <button (click)="openNotepad()">Notatnik</button>
        <button (click)="openCalculator()">Kalkulator</button>
      </div>
      <app-window *ngFor="let window of windows$ | async"
                 [window]="window">
      </app-window>
    </div>
  `,
  styles: [`
    .desktop {
      width: 100vw;
      height: 100vh;
      background: #008080;
      position: relative;
      overflow: hidden;
    }
    .taskbar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: #f0f0f0;
      padding: 4px;
      border-top: 1px solid #ccc;
    }
  `],
  imports: [WindowComponent]
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
