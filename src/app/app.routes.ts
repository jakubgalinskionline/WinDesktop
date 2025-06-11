import { Routes } from '@angular/router';
import { TableDragDropComponent } from './components/table-drag-drop/table-drag-drop.component';
import { DetailsComponent } from './components/details/details.component';

export const routes: Routes = [
  { path: '', component: TableDragDropComponent },
  { path: 'details/:id', component: DetailsComponent },];
