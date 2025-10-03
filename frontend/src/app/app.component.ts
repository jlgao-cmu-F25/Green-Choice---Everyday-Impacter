import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, DashboardComponent],
    template: `
    <app-dashboard></app-dashboard>
    <router-outlet />
  `,
    styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f5f7fa;
    }
  `]
})
export class AppComponent {
  title = 'everyday-impact-frontend';
}
