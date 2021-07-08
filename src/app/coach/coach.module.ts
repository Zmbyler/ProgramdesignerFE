import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoachRoutingModule } from './coach-routing.module';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CoachComponent } from './coach.component';
import { ProgramTemplatesComponent } from './program-templates/program-templates.component';
import { MyProgramsComponent } from './my-programs/my-programs.component';


@NgModule({
  declarations: [CoachComponent, ProgramTemplatesComponent, MyProgramsComponent],
  imports: [
    CommonModule,
    CoachRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ]
})
export class CoachModule { }
