import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoachComponent } from './coach.component';
import { ProgramTemplatesComponent } from './program-templates/program-templates.component';
import { MyProgramsComponent } from './my-programs/my-programs.component';


const routes: Routes = [
  {
    path: '',
    component: CoachComponent,
    children: [
      {
        path: 'program-templates',
        component: ProgramTemplatesComponent
      },
      {
        path: 'my-programs',
        component: MyProgramsComponent
      },
      {
        path: '',
        redirectTo: '/program-templates',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachRoutingModule { }
