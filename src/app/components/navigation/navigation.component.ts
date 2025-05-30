import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationIconComponent } from "../notification-icon/notification-icon.component";
import { UserNavIconComponent } from "../user-nav-icon/user-nav-icon.component";
import { WebContext } from '../../models/WebContext';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    NotificationIconComponent,
    UserNavIconComponent
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  webContext: WebContext = {} as WebContext;
}
