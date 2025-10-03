import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet />
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f5f7fa;
    }
  `]
})
export class AppComponent {
  title = 'everyday-impact-frontend';
}
