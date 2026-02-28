import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-modal',
  imports: [],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.scss',
})
export class ProductModal {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter();

  close() {
    this.closeModal.emit();
  }
}
