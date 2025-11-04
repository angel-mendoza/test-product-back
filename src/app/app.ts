import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Alert } from './components/ui/alert/alert';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, Alert],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bank-challenge');
}
