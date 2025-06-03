import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, AsyncPipe],
  template: `
    <div class="agent-container" [class.dark-mode]="isDarkMode$ | async">
      <div class="agent-header">
        <div class="agent-title">Asystent AI</div>
      </div>
      <div class="agent-content">
        <div class="chat-messages" #chatMessages>
          <div *ngFor="let message of messages" 
               [class.user-message]="message.type === 'user'"
               [class.agent-message]="message.type === 'agent'"
               class="message">
            <div class="message-content">{{message.text}}</div>
            <div class="message-time">{{message.time | date:'shortTime'}}</div>
          </div>
        </div>
        <div class="input-area">
          <input type="text" 
                 [(ngModel)]="userInput" 
                 (keyup.enter)="sendMessage()"
                 placeholder="Napisz wiadomość..."
                 [class.dark-input]="isDarkMode$ | async">
          <button (click)="sendMessage()" 
                  [class.dark-button]="isDarkMode$ | async">
            <i class="bi bi-send"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .agent-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: white;
      border-radius: 8px;
    }
    
    .dark-mode {
      background-color: #1e1e1e;
      color: #ffffff;
    }

    .agent-header {
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
    }

    .agent-title {
      font-size: 18px;
      font-weight: 500;
    }

    .agent-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 15px;
      overflow: hidden;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 15px;
    }

    .message {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 8px;
      max-width: 80%;
    }

    .user-message {
      margin-left: auto;
      background-color: #007bff;
      color: white;
    }

    .agent-message {
      margin-right: auto;
      background-color: #f0f0f0;
      color: black;
    }

    .dark-mode .agent-message {
      background-color: #2d2d2d;
      color: white;
    }

    .message-time {
      font-size: 12px;
      opacity: 0.7;
      margin-top: 5px;
      text-align: right;
    }

    .input-area {
      display: flex;
      gap: 10px;
      padding: 10px;
      border-top: 1px solid #e0e0e0;
    }

    input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      outline: none;
    }

    .dark-input {
      background-color: #2d2d2d;
      color: white;
      border-color: #3d3d3d;
    }

    button {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }

    .dark-button {
      background-color: #0056b3;
    }

    button:hover {
      opacity: 0.9;
    }
  `]
})
export class AgentComponent {
  isDarkMode$: Observable<boolean>;
  userInput: string = '';
  messages: Array<{type: 'user' | 'agent', text: string, time: Date}> = [];

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  sendMessage() {
    if (this.userInput.trim()) {
      // Dodaj wiadomość użytkownika
      this.messages.push({
        type: 'user',
        text: this.userInput,
        time: new Date()
      });

      // Symulacja odpowiedzi agenta (można zintegrować z rzeczywistym API)
      setTimeout(() => {
        this.messages.push({
          type: 'agent',
          text: 'Przepraszam, ale obecnie jestem w trybie demonstracyjnym i nie mogę odpowiedzieć na Twoje pytanie.',
          time: new Date()
        });
      }, 1000);

      this.userInput = '';
    }
  }
}
