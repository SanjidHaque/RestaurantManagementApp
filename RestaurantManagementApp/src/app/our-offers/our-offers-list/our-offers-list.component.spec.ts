import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurOffersListComponent } from './our-offers-list.component';

describe('OurOffersListComponent', () => {
  let component: OurOffersListComponent;
  let fixture: ComponentFixture<OurOffersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurOffersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurOffersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
