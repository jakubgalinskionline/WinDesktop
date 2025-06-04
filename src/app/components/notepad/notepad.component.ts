import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notepad.component.html',
  styleUrl: './notepad.component.css'
})
export class NotepadComponent {
  content: string = '';

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Wstaw tabulację
      this.content = this.content.substring(0, start) + '\t' + this.content.substring(end);

      // Ustaw kursor na właściwej pozycji
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 1;
      });
    }
  }

  clearContent() {
    this.content = '';
  }

  saveContent() {
    const blob = new Blob([this.content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notatnik.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  downloadContent() {
    const blob = new Blob([this.content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notatnik.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
