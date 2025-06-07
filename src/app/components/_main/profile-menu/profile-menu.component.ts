import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css',
})
export class ProfileMenuComponent {
  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  menuItems = [
    { link: '/profile', icon: 'ti ti-user', label: 'Profil' },
    { link: '/settings', icon: 'ti ti-settings', label: 'Ustawienia' }
  ];


}
