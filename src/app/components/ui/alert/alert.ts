import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Interfaces para el sistema de alertas
export interface AlertMessage {
  id: string;
  type: 'success' | 'error';
  title?: string;
  message: string;
  duration?: number;
  isVisible?: boolean;
}

// Servicio de Alertas (Injectable)
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<AlertMessage[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  success(message: string, title?: string, duration: number = 5000): void {
    this.addAlert({
      id: this.generateId(),
      type: 'success',
      title: title || 'Éxito',
      message,
      duration,
      isVisible: true
    });
  }

  error(message: string, title?: string, duration: number = 8000): void {
    this.addAlert({
      id: this.generateId(),
      type: 'error',
      title: title || 'Error',
      message,
      duration,
      isVisible: true
    });
  }

  private addAlert(alert: AlertMessage): void {
    const currentAlerts = this.alertsSubject.value;
    const newAlerts = [...currentAlerts, alert];
    this.alertsSubject.next(newAlerts);

    // Auto-remover después del tiempo especificado
    if (alert.duration && alert.duration > 0) {
      setTimeout(() => {
        this.removeAlert(alert.id);
      }, alert.duration);
    }
  }

  removeAlert(id: string): void {
    const currentAlerts = this.alertsSubject.value;
    const newAlerts = currentAlerts.filter(alert => alert.id !== id);
    this.alertsSubject.next(newAlerts);
  }

  clear(): void {
    this.alertsSubject.next([]);
  }
}

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert implements OnInit, OnDestroy {
  alerts: AlertMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.subscription = this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeAlert(id: string): void {
    this.alertService.removeAlert(id);
  }

  getAlertIcon(type: 'success' | 'error'): string {
    return type === 'success' ? '✓' : '✕';
  }
}
