import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowMessage } from '../../services/window-communication.service';
import { WindowableComponent } from '../../models/windowable.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="messages" #messagesContainer>
        <div *ngFor="let message of messages" class="message" [class.received]="message.fromId !== currentWindowId">
          <span class="message-text">{{ message.text }}</span>
          <span class="message-time">{{ message.time | date:'HH:mm' }}</span>
        </div>
      </div>
      <div class="input-area">        <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendChatMessage()" placeholder="Wpisz wiadomość...">
        <button (click)="sendChatMessage()">Wyślij</button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 10px;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 10px;
      padding: 10px;
    }

    .message {
      margin: 5px;
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 70%;
      background-color: #e9ecef;
      align-self: flex-start;
    }

    .message.received {
      background-color: #0d6efd;
      color: white;
      align-self: flex-end;
    }

    .message-text {
      display: block;
    }

    .message-time {
      font-size: 0.8em;
      opacity: 0.7;
    }

    .input-area {
      display: flex;
      gap: 8px;
    }

    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ced4da;
      border-radius: 4px;
    }

    button {
      padding: 8px 16px;
      background-color: #0d6efd;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0b5ed7;
    }

    :host-context([data-theme="dark"]) {
      .message {
        background-color: #495057;
        color: #e9ecef;
      }

      .message.received {
        background-color: #0d6efd;
      }

      input {
        background-color: #343a40;
        border-color: #495057;
        color: #e9ecef;
      }

      input::placeholder {
        color: #6c757d;
      }
    }
  `]
})
export class ChatComponent extends WindowableComponent implements OnInit {
  messages: Array<{
    fromId: number;
    text: string;
    time: Date;
  }> = [];
  newMessage = '';
  currentWindowId = -1;
  constructor() {
    super();
  }

  ngOnInit() {
    // ID okna jest dostępne z klasy bazowej
    this.currentWindowId = this.windowId;
  }

  override onWindowMessage(message: WindowMessage) {
    if (message.type === 'chat-message') {
      this.messages.push({
        fromId: message.fromId,
        text: message.data.text,
        time: new Date(message.timestamp)
      });
    }
  }

  sendChatMessage() {
    if (!this.newMessage.trim()) return;

    this.sendMessage('chat-message', {
      text: this.newMessage
    });

    this.messages.push({
      fromId: this.windowId,
      text: this.newMessage,
      time: new Date()
    });

    this.newMessage = '';
  }
}
