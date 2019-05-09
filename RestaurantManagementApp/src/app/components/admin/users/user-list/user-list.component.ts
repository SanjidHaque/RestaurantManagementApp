import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Table} from '../../../../models/table.model';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {UserAccount} from '../../../../models/user-account.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {

  userAccounts: UserAccount[] = [];

  displayedColumns: string[] =
    [
      'UserName',
      'RoleName',
      'PhoneNumber',
      'AddingDateTime'
    ];
  dataSource: MatTableDataSource<UserAccount>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Table[]) => {
          this.userAccounts = data['userAccounts'];
          this.dataSource = new MatTableDataSource(this.userAccounts);
        }
      );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
