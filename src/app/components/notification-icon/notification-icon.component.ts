import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-notification-icon',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.css']
})
export class NotificationIconComponent implements OnInit {
  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit(): void {}
}
