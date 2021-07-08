import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from '../material.module';
import { ModalModule } from '../modal/modal.module';
import { LoaderModule } from '../loader/loader.module';

import { SharedModule } from '../shared/shared.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { InnerCircleComponent } from './inner-circle/inner-circle.component';
import { TermsOfServicesComponent } from './terms-of-services/terms-of-services.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PdfGenerationComponent } from './pdf-generation/pdf-generation.component';



@NgModule({
  declarations: [
    HomeComponent, AboutUsComponent,
    ContactUsComponent, InnerCircleComponent, TermsOfServicesComponent, PrivacyPolicyComponent, PdfGenerationComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    ModalModule,
    LoaderModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
  ]
})
export class PagesModule { }
