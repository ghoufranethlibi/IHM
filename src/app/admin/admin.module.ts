import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUsersComponent } from './admin-users.component';
import { AdminRolesComponent } from './admin-roles.component';

@NgModule({
  declarations: [AdminUsersComponent, AdminRolesComponent],
  imports: [CommonModule, AdminRoutingModule]
})
export class AdminModule {}
