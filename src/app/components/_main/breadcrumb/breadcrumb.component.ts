import { Component, Input } from '@angular/core';
import { WebContext } from '../../models/WebContext';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
  inputs: ['webContext']
})
export class BreadcrumbComponent {
  @Input() webContext : WebContext = {} as WebContext;
}
