import { Component, OnInit } from '@angular/core';
import {Table} from '../../../models/table.model';
import {ActivatedRoute} from '@angular/router';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['./select-table.component.scss']
})
export class SelectTableComponent implements OnInit {

  tables: Table[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: Table[]) => this.tables = data['tables'] );
  }


}
