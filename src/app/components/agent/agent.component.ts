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
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss'
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
