import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, DashboardComponent],
    template: `
    <div class="block min-h-screen bg-gray-50">
      <app-dashboard></app-dashboard>
      <router-outlet />
    </div>
  `,
    styles: []
})
export class AppComponent {
  title = 'everyday-impact-frontend';
}
