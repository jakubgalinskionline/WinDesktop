import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-drag-drop-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-drag-drop-details.component.html',
  styleUrls: ['./table-drag-drop-details.component.css']
})
export class TableDragDropDetailsComponent implements OnInit {
  @Input() cellValue: string = '';

  ngOnInit() {
    // Inicjalizacja komponentu
  }
}
