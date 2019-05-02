import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Table} from '../../../../models/table.model';
import {MatTableDataSource} from '@angular/material';
import {Role} from '../../../../models/role.model';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {
  isDisabled = false;
  roles: Role[] = [];


  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrManager) { }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Role[]) => {
          this.roles = data['roles'];
        }
      );
  }

  register() {}
}
