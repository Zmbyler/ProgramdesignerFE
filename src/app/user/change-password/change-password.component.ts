import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormService } from 'src/app/services/form.service';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/global';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  @ViewChild('changePasswordForm', { static: true }) private changePasswordForm: any;

  constructor(
    private api: ApiService,
    private event: EventService,
    private storage: StorageService,
    private forms: FormService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.forms.formInit(this.changePasswordForm);
  }

    ChangePassword(data: LoginModel) {
      if (this.form.valid) {
        if (this.form.value.old_password === this.form.value.new_password) {
          this.api.alert('Old password and New Password can not be same', 'error');
        } else {
          this.api.postx('user/changePassword', data).subscribe((res: any) => {
            if (res.success) {
              this.form.reset();
              this.api.alert(res.message, 'success');
            } else {
              this.api.alert(res.message, 'error');
            }
          }, error => {
            this.api.alert(error.message, 'error');
          });
        }
      } else {
        Object.keys(this.form.controls).forEach(key => {
          this.form.get(key).markAsTouched({ onlySelf: true });
        });
      }
    }
}
