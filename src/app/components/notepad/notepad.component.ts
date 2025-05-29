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
  handleKeydown: any;

  constructor() {
    // Inicjalizacja lub inne operacje
  }

  clearContent() {
    throw new Error('Method not implemented.');
  }

  downloadContent() {
   throw new Error('Method not implemented.');
  }

  saveContent() {
    // Tutaj możesz dodać logikę zapisywania
    console.log('Zapisano:', this.content);
  }
}
