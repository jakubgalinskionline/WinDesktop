import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notepad">
      <div class="toolbar">
        <input
          type="file"
          #fileInput
          (change)="openFile($event)"
          accept=".txt"
          style="display: none;">
        <button (click)="fileInput.click()">
          <i class="bi bi-folder2-open"></i>
          Otwórz
        </button>
        <button (click)="saveToFile()">
          <i class="bi bi-save"></i>
          Zapisz
        </button>
        <button (click)="clearContent()">
          <i class="bi bi-trash"></i>
          Wyczyść
        </button>
      </div>
      <textarea
        #textArea
        [(ngModel)]="text"
        placeholder="Wpisz lub wklej tekst..."
        class="notepad-content"
        (dragover)="onDragOver($event)"
        (drop)="onDrop($event)">
      </textarea>
      <div class="status-bar">
        {{ getStatusText() }}
      </div>
    </div>
  `,
  styles: [`
    .notepad {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--window-background, #fff);
    }

    .toolbar {
      display: flex;
      gap: 8px;
      padding: 8px;
      background: var(--toolbar-background, #f5f5f5);
      border-bottom: 1px solid var(--border-color, #ddd);
    }

    .toolbar button {
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 5px;
      border: none;
      border-radius: 4px;
      background: var(--button-background, #fff);
      color: var(--button-color, #333);
      cursor: pointer;
      transition: all 0.2s;
    }

    .toolbar button:hover {
      background: var(--button-hover-background, #e9e9e9);
    }

    .notepad-content {
      flex: 1;
      width: 100%;
      padding: 12px;
      border: none;
      resize: none;
      background: var(--content-background, #fff);
      color: var(--content-color, #333);
      font-size: 14px;
      line-height: 1.5;
      font-family: 'Consolas', monospace;
    }

    .notepad-content:focus {
      outline: none;
    }

    .status-bar {
      padding: 4px 8px;
      background: var(--statusbar-background, #f5f5f5);
      border-top: 1px solid var(--border-color, #ddd);
      font-size: 12px;
      color: var(--statusbar-color, #666);
    }

    /* Dark theme */
    :host-context([data-theme="dark"]) {
      --window-background: #1e1e1e;
      --toolbar-background: #2d2d2d;
      --button-background: #383838;
      --button-color: #e9ecef;
      --button-hover-background: #454545;
      --content-background: #1e1e1e;
      --content-color: #e9ecef;
      --border-color: #3d3d3d;
      --statusbar-background: #2d2d2d;
      --statusbar-color: #999;
    }
  `]
})
export class NotepadComponent {
  text: string = '';
  currentFileName: string = 'Nowy dokument';
  modified: boolean = false;

  constructor() {
    // Nasłuchuj zmian w tekście
    setInterval(() => {
      if (this.text !== localStorage.getItem('notepadContent')) {
        this.modified = true;
      }
    }, 1000);
  }

  openFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.text = e.target?.result as string;
        this.currentFileName = file.name;
        this.modified = false;
        localStorage.setItem('notepadContent', this.text);
      };
      reader.readAsText(file);
    }
  }

  saveToFile(): void {
    const blob = new Blob([this.text], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.modified = false;
    localStorage.setItem('notepadContent', this.text);
  }

  clearContent(): void {
    if (this.modified && this.text.length > 0) {
      if (confirm('Czy na pewno chcesz wyczyścić zawartość? Niezapisane zmiany zostaną utracone.')) {
        this.text = '';
        this.currentFileName = 'Nowy dokument';
        this.modified = false;
        localStorage.removeItem('notepadContent');
      }
    } else {
      this.text = '';
      this.currentFileName = 'Nowy dokument';
      this.modified = false;
      localStorage.removeItem('notepadContent');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.text = e.target?.result as string;
          this.currentFileName = file.name;
          this.modified = false;
          localStorage.setItem('notepadContent', this.text);
        };
        reader.readAsText(file);
      }
    }
  }

  getStatusText(): string {
    return `${this.currentFileName}${this.modified ? ' *' : ''} | ${this.text.length} znaków`;
  }
}
