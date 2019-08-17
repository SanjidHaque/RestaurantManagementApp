import { Component } from '@angular/core';
import {MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-order-cancel-option',
  templateUrl: './order-cancellation-option.component.html',
  styleUrls: ['./order-cancellation-option.component.scss']
})
export class OrderCancellationOptionComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<OrderCancellationOptionComponent>) {

  }
  closeSheet(action: string) {
    this.bottomSheetRef.dismiss(action);
  }
}
