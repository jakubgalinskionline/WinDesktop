import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.css']
})
export class NotepadComponent implements OnInit, OnDestroy {
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;
  @Input() defaultContent: string = '';
  @Input() maxLength: number = 50000;

  @Output() onContentChange = new EventEmitter<string>();
  @Output() onSave = new EventEmitter<string>();

  notepadForm: FormGroup;
  currentFileName: string = 'Nowy dokument';
  modified: boolean = false;
  private subscription = new Subscription();

  constructor(private fb: FormBuilder) {
    this.notepadForm = this.fb.group({
      content: ['', [Validators.maxLength(this.maxLength)]]
    });
  }

  get contentControl() {
    return this.notepadForm.get('content');
  }

  ngOnInit(): void {
    // Ustaw początkową zawartość
    this.notepadForm.patchValue({ content: this.defaultContent });

    // Nasłuchuj zmian w formularzu
    this.subscription.add(
      this.contentControl?.valueChanges.subscribe(value => {
        this.modified = true;
        this.onContentChange.emit(value);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    this.currentFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      this.notepadForm.patchValue({ content });
      this.modified = false;
    };
    reader.readAsText(file);
  }

  saveToFile(): void {
    const content = this.notepadForm.get('content')?.value;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.currentFileName;
    a.click();
    window.URL.revokeObjectURL(url);

    this.modified = false;
    this.onSave.emit(this.currentFileName);
  }

  clearContent(): void {
    this.notepadForm.patchValue({ content: '' });
    this.currentFileName = 'Nowy dokument';
    this.modified = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (!files?.length) return;

    const file = files[0];
    if (file.type === 'text/plain') {
      this.currentFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.notepadForm.patchValue({ content });
        this.modified = false;
      };
      reader.readAsText(file);
    }
  }

  getStatusText(): string {
    const errors = this.contentControl?.errors;
    if (errors?.['maxlength']) {
      return `Przekroczono maksymalną długość tekstu (${this.maxLength} znaków)`;
    }
    return this.modified ? 'Zmodyfikowano' : 'Zapisano';
  }
}
