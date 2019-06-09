import { Component } from '@angular/core';
import {MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-order-cancel-option',
  templateUrl: './order-cancel-option.component.html',
  styleUrls: ['./order-cancel-option.component.scss']
})
export class OrderCancelOptionComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<OrderCancelOptionComponent>) {

  }
  closeSheet(action: string) {
    this.bottomSheetRef.dismiss(action);
  }
}
