import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactUsText: any;
  form: FormGroup;
  constructor(
    private api: ApiService,
    private storage: StorageService,
  ) {
    this.contactUsText = undefined;
  }

  ngOnInit(): void {
    this.getContactUsData();
    this.formInit();
  }
  getContactUsData() {
    this.api.get(`user/getcontactPage`).subscribe((res: any) => {
      if (res.success) {
        this.contactUsText = res.data;
      } else {
        this.api.alert(res.message, 'error');
      }
    }, error => {
      this.api.alert(error.message, 'error');
    });
  }
  formInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)]),
      query: new FormControl('', Validators.required),
      message: new FormControl('', [Validators.required, Validators.pattern('.*[^ ].*')]),
    });
  }
  submit(data: any) {
    if (this.form.valid) {
      this.api.postx('user/contactUs', data).subscribe((res: any) => {
        if (res.success) {
          this.form.reset();
          this.api.alert(res.message, 'success');
        } else {
          this.api.alert(res.message, 'error');
        }
      }, error => {
        this.api.alert(error.message, 'error');
      });
    } else {
      this.form.markAllAsTouched();
    }
  }


}
