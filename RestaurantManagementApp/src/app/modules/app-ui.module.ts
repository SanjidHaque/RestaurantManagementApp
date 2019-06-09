import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';

import {NgxPaginationModule} from 'ngx-pagination';
import {OrderCancelOptionComponent} from '../bottom-sheets/order-cancel-option/order-cancel-option.component';


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
    MatBottomSheetModule,
    NgxPaginationModule
  ],
  exports: [
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatListModule,
    MatBottomSheetModule,
    NgxPaginationModule
  ],
  entryComponents: [
    OrderCancelOptionComponent
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
