import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitauxComponent } from './vitaux.component';

describe('VitauxComponent', () => {
  let component: VitauxComponent;
  let fixture: ComponentFixture<VitauxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VitauxComponent]
    });
    fixture = TestBed.createComponent(VitauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
