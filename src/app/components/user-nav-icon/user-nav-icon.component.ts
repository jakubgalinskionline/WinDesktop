import { Component, Input } from '@angular/core';
import { WebContext } from '../../models/WebContext';

@Component({
  selector: 'app-user-nav-icon',
  standalone: true,
  imports: [],
  templateUrl: './user-nav-icon.component.html',
  styleUrl: './user-nav-icon.component.css',
  inputs: ['webContext'],
})
export class UserNavIconComponent {
  @Input() webContext: WebContext = {} as WebContext;
}
