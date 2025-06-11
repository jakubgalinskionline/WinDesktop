import { Routes } from '@angular/router';
import { DesktopComponent } from './components/_main/_desktop/desktop.component';

export const routes: Routes = [
  { path: '', component: DesktopComponent },
  { path: '**', redirectTo: '/' } // Redirect any unknown paths to the desktop component
];

