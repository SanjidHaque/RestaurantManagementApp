import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  imageUrl = '/assets/img/default-image.png';
  fileToUpload: File = null;
  constructor(private _dataStorageService: DataStorageService) { }

  ngOnInit() {
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    // Show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  OnSubmit(Caption, Image) {
    this._dataStorageService.postFile(Caption.value, this.fileToUpload).subscribe(
      data =>{
        console.log('done');
        Caption.value = null;
        Image.value = null;
        this.imageUrl = '/assets/img/default-image.png';
      }
    );
  }
}
