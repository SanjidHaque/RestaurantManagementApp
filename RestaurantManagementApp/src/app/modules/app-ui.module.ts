import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule, MatNativeDateModule, MatButtonModule} from '@angular/material';

import {NgxPaginationModule} from 'ngx-pagination';
import {OrderCancellationOptionComponent} from '../bottom-sheets/order-cancellation-option/order-cancellation-option.component';
import {OrderCancellationReasonComponent} from '../bottom-sheets/order-cancellation-reason/order-cancellation-reason.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NgxPaginationModule
  ],
  exports: [
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NgxPaginationModule
  ],
  entryComponents: [
    OrderCancellationOptionComponent,
    OrderCancellationReasonComponent
  ],
  providers: [
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue:
        {
          hasBackdrop: true,
          disableClose: true
        }
    }
  ]
})
export class AppUiModule { }
