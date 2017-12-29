import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  lat: number = 23.754093;
  lng: number = 90.393267;
  zoom = 18;
  constructor() { }

  ngOnInit() {
  }

}
