import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-icon',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.css']
})
export class NotificationIconComponent implements OnInit {
  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit(): void {}

  notificationItems = [
    { link: '/profile', label: 'Critical alert: Server crash detected', time: '30 minutes ago' },
    { link: '/profile', label: 'High memory usage on Node', time: '10 minutes ago' },
    { link: '/profile', label: 'Backup completed successfully', time: '1 hour ago' },
    { link: '/profile', label: 'New user registration: Sarah Miles', time: 'Just now' },
    { link: '/profile', label: 'Bug reported in payment module', time: '20 minutes ago' },
    { link: '/profile', label: 'New comment on Task #142', time: '15 minutes ago' },
    { link: '/profile', label: 'Low battery on Device X', time: '45 minutes ago' },
    { link: '/profile', label: 'File upload completed', time: '1 hour ago' },
    { link: '/profile', label: 'Team meeting scheduled at 3 PM', time: '2 hour ago' },
    { link: '/profile', label: 'Report ready for download', time: '3 hours ago' },
    { link: '/profile', label: 'Multiple failed login attempts', time: '5 hours ago' },
    { link: '/profile', label: 'Database nearing capacity', time: 'Yesterday' },
    { link: '/profile', label: 'System check completed', time: '2 days ago' },
  ];

}
