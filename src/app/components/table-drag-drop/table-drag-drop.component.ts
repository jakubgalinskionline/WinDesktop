import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropService } from '../../services/drag-and-drop.service';

interface TableCell {
  value: string;
  row: number;
  col: number;
}

@Component({
  selector: 'app-table-drag-drop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table>
        <tbody>
          <tr *ngFor="let row of tableData; let i = index">
            <td *ngFor="let cell of row; let j = index"
                [id]="getTableCellId(i, j)"
                [draggable]="true"
                (dragstart)="onDragStart($event, i, j)"
                (dragover)="onDragOver($event)"
                (drop)="onDrop($event, i, j)"
                (dragenter)="onDragEnter($event)"
                (dragleave)="onDragLeave($event)"
                [class.drag-over]="isDragOver && currentDragTarget === getTableCellId(i, j)"
                >
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
      cursor: move;
      transition: all 0.3s ease;
    }

    td:hover {
      background-color: #f5f5f5;
    }

    .drag-over {
      background-color: #e3f2fd;
      border: 2px dashed #2196f3;
    }
  `]
})
export class TableDragDropComponent implements OnInit {
  @Input() containerId!: string;
  @Input() rows: number = 4;
  @Input() cols: number = 4;

  tableData: string[][] = [];
  isDragOver: boolean = false;
  currentDragTarget: string | null = null;

  constructor(private dragDropService: DragAndDropService) {}

  ngOnInit() {
    // Inicjalizacja przykładowych danych
    this.tableData = Array(this.rows).fill(0).map((_, i) =>
      Array(this.cols).fill(0).map((_, j) => `${this.containerId}-${i+1},${j+1}`)
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
