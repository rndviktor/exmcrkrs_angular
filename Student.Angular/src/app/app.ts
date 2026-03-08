import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
  <h2>{{title()}}</h2>
  <br/>

  <router-outlet/>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Student.Angular');
}
