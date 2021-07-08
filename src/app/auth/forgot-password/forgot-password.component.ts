import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormService } from 'src/app/services/form.service';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/global';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  @ViewChild('ForgotPasswordform', { static: true }) private ForgotPasswordform: any;

  constructor(
    private api: ApiService,
    private event: EventService,
    private storage: StorageService,
    private forms: FormService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.forms.formInit(this.ForgotPasswordform);
  }
  forgotPassword(data: LoginModel) {
    if (this.form.valid) {
        this.api.post('user/forgotPassword', data).subscribe((res: any) => {
          if (res.success) {
            this.form.reset();
            this.api.alert(res.message, 'success');
            this.router.navigate(['/login']);
          } else {
            this.api.alert(res.message, 'error');
          }
        }, error => {
          this.api.alert(error.message, 'error');
        });
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched({ onlySelf: true });
      });
    }
  }

}
