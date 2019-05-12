import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { Component, OnInit } from '@angular/core';

import {Setting} from '../../../../models/setting.model';
import {ToastrManager} from 'ng6-toastr-notifications';
import {SettingDataStorageService} from '../../../../services/data-storage/setting-data-storage.service';

@Component({
  selector: 'app-edit-setting',
  templateUrl: './edit-setting.component.html',
  styleUrls: ['./edit-setting.component.scss']
})
export class EditSettingComponent implements OnInit {
  setting: Setting;

  constructor(private route: ActivatedRoute,
              private toastr: ToastrManager,
              private settingDataStorageService: SettingDataStorageService) {}

  ngOnInit() {
    this.route.data.subscribe( (data: Setting) => this.setting = data['settings']);
  }

  editSetting(form: NgForm) {
    // if (form.value.shopName === this.setting.ShopName &&
    //   form.value.vat === this.setting.VatAmount ) {
    //   this.toastr.successToastr('Information updated', 'Success', {
    //     toastTimeout: 10000,
    //     newestOnTop: true,
    //     showCloseButton: true
    //   });
    //   return;
    // }
    //
    // this.settingDataStorageService.editSetting(
    //   new Setting(
    //     null,
    //     form.value.shopName,
    //     form.value.vat
    //     form.value.vat
    //     form.value.vat
    //     form.value.vat
    //     form.value.vat
    //     form.value.vat
    //   )
    // ).subscribe( (data: any) => {
    //   this.toastr.successToastr('Information updated', 'Success', {
    //     toastTimeout: 10000,
    //     newestOnTop: true,
    //     showCloseButton: true
    //   });
    // });
  }
}
