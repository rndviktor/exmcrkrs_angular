import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  hostDirectives: [],
  template: `
    <h2>{{title()}}</h2>
    <br/>

    <router-outlet />
  `,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Teacher.Angular');
}
