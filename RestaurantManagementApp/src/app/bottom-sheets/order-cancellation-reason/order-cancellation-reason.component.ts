import { Component, OnInit } from '@angular/core';
import {MatBottomSheetRef} from '@angular/material';
import {PointOfSaleService} from '../../services/shared/point-of-sale.service';

@Component({
  selector: 'app-order-cancellation-reason',
  templateUrl: './order-cancellation-reason.component.html',
  styleUrls: ['./order-cancellation-reason.component.scss']
})
export class OrderCancellationReasonComponent implements OnInit {
  orderCancellationReasons = [];
  defaultReason = 'A';

  constructor(private pointOfSaleService: PointOfSaleService,
              private bottomSheetRef: MatBottomSheetRef<OrderCancellationReasonComponent>) { }

  ngOnInit() {
    this.orderCancellationReasons = this.pointOfSaleService.orderCancellationReasons;
  }

  getReason(event: any) {
    this.defaultReason = event.target.value;

    if (this.defaultReason === '') {
      this.defaultReason = 'A'
    }
  }

  submitReason() {
    this.bottomSheetRef.dismiss(this.defaultReason);
  }

  dismiss() {
    this.bottomSheetRef.dismiss('Dismiss');
  }
}
