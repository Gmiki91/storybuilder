import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StownryComponent } from './stownry.component';

describe('StownryComponent', () => {
  let component: StownryComponent;
  let fixture: ComponentFixture<StownryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StownryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StownryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
