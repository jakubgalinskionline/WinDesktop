import { TableDragDropDetailsComponent } from './../table-drag-drop-details/table-drag-drop-details.component';
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropService } from '../../services/drag-and-drop.service';
import { WindowService } from '../../services/window.service';

interface TableCell {
  value: string;
  row: number;
  col: number;
}

@Component({
  selector: 'app-table-drag-drop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-drag-drop.component.html',
  styleUrls: ['./table-drag-drop.component.css']
})
export class TableDragDropComponent implements OnInit {
  @Input() containerId!: string;
  @Input() rows: number = 4;
  @Input() cols: number = 4;

  tableData: string[][] = [];
  isDragOver: boolean = false;
  currentDragTarget: string | null = null;
  constructor(
    private dragDropService: DragAndDropService,
    private windowService: WindowService
  ) {}

  ngOnInit() {
    // Inicjalizacja przykładowych danych
    this.tableData = Array(this.rows).fill(0).map((_, i) =>
      Array(this.cols).fill(0).map((_, j) => `${this.containerId}-${i+1},${j+1}`)
    );
  }

  saveTableData() {
    const jsonData = JSON.stringify(this.tableData);
    console.log('Zapisane dane tabeli:', jsonData);
  }

  isLink(cell: any): boolean {
    // Sprawdzamy czy komórka zawiera ID
    return typeof cell === 'string' && cell.includes('-');
  }  openDetails(cell: string) {
    const x = Math.random() * (window.innerWidth - 400);
    const y = Math.random() * (window.innerHeight - 400);

    this.windowService.openWindow(
      TableDragDropDetailsComponent,
      'Szczegóły',
      x,
      y,
      400,
      400,
      true,
      { cellValue: cell }
    );
  }

  getTableCellId(row: number, col: number): string {
    return `${this.containerId}-cell-${row}-${col}`;
  }

  onDragStart(event: DragEvent, row: number, col: number) {
    if (!event.dataTransfer) return;

    const cellData: TableCell = {
      value: this.tableData[row][col],
      row: row,
      col: col
    };

    event.dataTransfer.setData('application/json', JSON.stringify(cellData));
    event.dataTransfer.effectAllowed = 'move';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    event.dataTransfer.dropEffect = 'move';
  }

  onDragEnter(event: DragEvent) {
    const target = event.target as HTMLElement;
    this.isDragOver = true;
    this.currentDragTarget = target.id;
  }

  onDragLeave(event: DragEvent) {
    const target = event.target as HTMLElement;
    if (target.id === this.currentDragTarget) {
      this.isDragOver = false;
      this.currentDragTarget = null;
    }
  }

  onDrop(event: DragEvent, targetRow: number, targetCol: number) {
    event.preventDefault();
    this.isDragOver = false;
    this.currentDragTarget = null;

    if (!event.dataTransfer) return;

    try {
      const cellData: TableCell = JSON.parse(event.dataTransfer.getData('application/json'));
      const sourceValue = cellData.value;
      const [sourceContainerId] = sourceValue.split('-');

      // Aktualizuj wartości tylko jeśli to różne kontenery
      if (sourceContainerId !== this.containerId) {
        this.tableData[targetRow][targetCol] = sourceValue;
      }
    } catch (error) {
      console.error('Błąd podczas przetwarzania upuszczonych danych:', error);
    }
  }
}
