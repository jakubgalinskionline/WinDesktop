import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  isDarkMode$: Observable<boolean>;
  currentYear: number = new Date().getFullYear();

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }
}
