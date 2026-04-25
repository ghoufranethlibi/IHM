import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly destroyRef = inject(DestroyRef);
  loading = false;
  errorMsg = '';
  successMsg = '';

  readonly roleOptions = [
    { label: 'Administrateur', value: 'ROLE_ADMIN' },
    { label: 'Médecin', value: 'ROLE_MEDECIN' },
    { label: 'Infirmier', value: 'ROLE_INFIRMIER' },
    { label: 'Agent médical', value: 'ROLE_AGENT_MEDICAL' },
    { label: 'Patient', value: 'ROLE_PATIENT' }
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
      ]
    ],
    role: ['ROLE_PATIENT', [Validators.required]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.errorMsg = '';
    this.successMsg = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, role } = this.form.getRawValue();
    this.loading = true;
    this.auth.register(email.trim(), password, role).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Compte créé avec succès. Vous pouvez maintenant vous connecter.';
        setTimeout(() => void this.router.navigate(['/auth/login']), 800);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Inscription impossible. Vérifiez les données.';
      }
    });
  }

  trackByRole(_index: number, role: { label: string; value: string }): string {
    return role.value;
  }
}
