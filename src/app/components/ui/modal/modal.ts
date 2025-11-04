import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() isOpen: boolean = false;
  @Input() message: string = '';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() showCancel: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    // Solo cerrar si se hace clic en el backdrop, no en el contenido del modal
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
