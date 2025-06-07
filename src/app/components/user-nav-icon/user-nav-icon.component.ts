import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-nav-icon',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './user-nav-icon.component.html',
  styleUrl: './user-nav-icon.component.css',
})
export class UserNavIconComponent {
  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  menuItems = [
    { link: '/profile', icon: 'ti ti-user', label: 'Profil' },
    { link: '/settings', icon: 'ti ti-settings', label: 'Ustawienia' }
  ];


}
