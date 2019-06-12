import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent{
  screenWidth: number;
  constructor() { this.getCurrentScreenSize(); }

  @HostListener('window:resize', ['$event'])
  getCurrentScreenSize() {
    this.screenWidth = window.innerWidth;
  }
}

