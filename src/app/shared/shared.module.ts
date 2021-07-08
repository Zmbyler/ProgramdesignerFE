import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { BannerComponent } from './banner/banner.component';
import { ResultsComponent } from './results/results.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent, FooterComponent,
    BannerComponent, ResultsComponent],
  exports: [
    HeaderComponent, FooterComponent,
    BannerComponent, ResultsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
