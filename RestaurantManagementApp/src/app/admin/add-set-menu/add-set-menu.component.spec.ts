import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSetMenuComponent } from './add-set-menu.component';

describe('AddSetMenuComponent', () => {
  let component: AddSetMenuComponent;
  let fixture: ComponentFixture<AddSetMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSetMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSetMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
