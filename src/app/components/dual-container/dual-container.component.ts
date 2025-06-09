import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropComponent } from '../drag-and-drop/drag-and-drop.component';

@Component({
  selector: 'app-dual-container',
  standalone: true,
  imports: [CommonModule, DragAndDropComponent],
  templateUrl: './dual-container.component.html',
  styleUrls: ['./dual-container.component.css']
})
export class DualContainerComponent {}
