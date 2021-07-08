import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginModel, AuthModel } from 'src/app/global';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormService } from 'src/app/services/form.service';
import { Router } from '@angular/router';
import * as _ from 'underscore';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  form: FormGroup;
  isLoggedIn: boolean;


  @ViewChild('loginForm', { static: true }) private loginForm: any;

  constructor(
    private api: ApiService,
    private event: EventService,
    private storage: StorageService,
    private forms: FormService,
    private router: Router
  ) {
    this.event.isLogin.subscribe((res: boolean) => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
   }

  ngOnInit(): void {
    // this.form = this.forms.formInit(this.loginForm);
    // this.form.patchValue({
    //   email: 'best@yopmail.com',
    //   password: '12345678'
    // });
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)]),
      password: new FormControl('', Validators.required),
    });
  }

  // LOGIN SUBMIT BUTON
  loginInit(data: LoginModel) {
    if (this.form.valid) {
      // this.form.controls.email.updateValueAndValidity
      // '=================================================================';
      // if (JSON.stringify(data) === JSON.stringify(this.dummyLogin)) {
      //   const authData: AuthModel = new AuthModel({
      //     token: 'USER TOKEN',
      //     username: 'DEMO USER',
      //     role: 'user'
      //   });

      //   this.storage.setUser(authData);
      //   this.api.alert('You have successfully login', 'success');
      //   this.event.setLoginEmmit(true);
      //   this.router.navigate(['/dashboard']);
      // } else {
      //   this.api.alert('Some thing went wrong', 'error');
      // }
      // '=================================================================';
      this.api.post('user/login', data).subscribe((res: any) => {
        if (res.success) {
          const authData: AuthModel = new AuthModel({
            token: res.token,
            username: res.data.first_name + ' ' + res.data.last_name,
            role: res.data.role,
            isLogin: res.data.step > 2,
            profileImage: this.isExist(res.data.profile_image) ? res.data.profile_image : ''
          });
          this.storage.setUser(authData);
          if (!authData.isLogin) {
            this.storage.setTempData({ step: res.data.step });
            this.router.navigate(['/register']);
          } else {
            this.event.setLoginEmmit(true);
            this.router.navigate(['/dashboard']);
          }
          // this.api.alert(res.message, 'success');
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

  isExist(val) {
    if (_.isNull(val) || _.isEmpty(val) || _.isEmpty(val)) {
      return false;
    } else {
      return val;
    }
  }

}
