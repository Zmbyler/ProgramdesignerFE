import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { BuildComponent } from './build/build.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
  declarations: [DashboardComponent, UserComponent, ProfileComponent, BuildComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserModule { }
