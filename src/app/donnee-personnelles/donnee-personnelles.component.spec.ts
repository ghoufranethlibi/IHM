import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonneePersonnellesComponent } from './donnee-personnelles.component';

describe('DonneePersonnellesComponent', () => {
  let component: DonneePersonnellesComponent;
  let fixture: ComponentFixture<DonneePersonnellesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonneePersonnellesComponent]
    });
    fixture = TestBed.createComponent(DonneePersonnellesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
