import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.css']
})
export class NotepadComponent {
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;

  text: string = '';
  currentFileName: string = 'Nowy dokument';
  modified: boolean = false;

  onTextChange(): void {
    this.modified = true;
  }

  openFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.text = e.target?.result as string;
        this.currentFileName = file.name;
        this.modified = false;
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
  }

  clearContent(): void {
    if (this.modified && this.text.length > 0) {
      if (confirm('Czy na pewno chcesz wyczyścić zawartość? Niezapisane zmiany zostaną utracone.')) {
        this.text = '';
        this.currentFileName = 'Nowy dokument';
        this.modified = false;
      }
    } else {
      this.text = '';
      this.currentFileName = 'Nowy dokument';
      this.modified = false;
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
        };
        reader.readAsText(file);
      }
    }
  }

  getStatusText(): string {
    return `${this.currentFileName}${this.modified ? ' *' : ''} | ${this.text.length} znaków`;
  }
}
