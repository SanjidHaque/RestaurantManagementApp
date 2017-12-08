import { Component, OnInit } from '@angular/core';
import { ICarouselConfig, AnimationConfig } from 'angular4-carousel';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  public imageSources: string[] = [
    'assets/ImageOne.jpg',
    'assets/ImageTwo.jpg',
    'assets/ImageThree.jpg',
    'assets/ImageFour.jpg',
    'assets/ImageFive.jpg'
  ];

  public config: ICarouselConfig = {
    verifyBeforeLoad: false,
    log: false,
    animation: true,
    animationType: AnimationConfig.SLIDE,
    autoplay: true,
    autoplayDelay: 3000,
    stopAutoplayMinWidth: 768,
  };

  constructor() { }

  ngOnInit() {
  }

}
