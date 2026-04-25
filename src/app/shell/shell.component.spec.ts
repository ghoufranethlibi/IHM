import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ShellComponent } from './shell.component';
import { AuthService } from '../../core/auth/auth.service';
import { of } from 'rxjs';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ShellComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            hasRole: () => false,
            logout: jasmine.createSpy('logout'),
            currentUser$: of(null)
          }
        }
      ]
    });
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
