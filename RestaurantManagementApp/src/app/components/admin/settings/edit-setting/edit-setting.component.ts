import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';

import {Setting} from '../../../../models/setting.model';
import {SettingDataStorageService} from '../../../../services/data-storage/setting-data-storage.service';

@Component({
  selector: 'app-edit-setting',
  templateUrl: './edit-setting.component.html',
  styleUrls: ['./edit-setting.component.scss']
})
export class EditSettingComponent implements OnInit {
  isDisabled = false;
  setting: Setting;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private settingDataStorageService: SettingDataStorageService) {}

  ngOnInit() {
    this.route.data.subscribe( (data: Setting) => this.setting = data['settings']);
  }

  changeCheckBoxValue(event: any) {
    this.setting.PrintChefsOrderReceipt = event.target.checked;
  }

  editSetting(form: NgForm) {
    this.isDisabled = true;

    this.settingDataStorageService.editSetting(
      new Setting(
        null,
        form.value.shopName,
        form.value.shopAddress,
        form.value.shopPhone,
        form.value.shopEmail,
        form.value.shopFacebookPage,
        form.value.vatAmount,
        form.value.vatRegNumber,
        form.value.vatType,
        form.value.serviceCharge,
        form.value.additionalInformation,
        this.setting.PrintChefsOrderReceipt
      )
    ).subscribe((data: any) => {
      if (data.StatusText !== 'Success') {
        this.isDisabled = false;
        this.toastr.errorToastr(data.StatusText, 'Error');
        return;
      }

      this.toastr.successToastr('Information updated', 'Success');
      this.router.navigate(['admin/settings']);
    });
  }
}
