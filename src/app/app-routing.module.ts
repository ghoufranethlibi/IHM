import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

/**
 * Root routing: auth is lazy-loaded; the shell wraps all authenticated feature areas.
 * Feature modules are lazy-loaded to keep initial bundle small (Angular best practice).
 */
const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Medecin', 'Infirmier', 'AgentMedical', 'Patient'] },
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'search',
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Medecin', 'Infirmier', 'AgentMedical'] },
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchModule)
      },
      {
        path: 'dossier',
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Medecin', 'Infirmier', 'AgentMedical', 'Patient'] },
        loadChildren: () =>
          import('./dossier/dossier.module').then((m) => m.DossierModule)
      },
      {
        path: 'admin',
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule)
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
