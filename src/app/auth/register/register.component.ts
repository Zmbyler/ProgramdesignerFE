import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthModel } from 'src/app/global';
import * as _ from 'underscore';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  switchCase: number;
  profileImage: string;
  profileImageFile: File;
  timeZoneList: Observable<any>;
  countryList: Observable<any>;
  businessDescription: Observable<any>;
  bestDescription: Observable<any>;
  // tslint:disable-next-line: variable-name
  business_description_other_display = false;
  // tslint:disable-next-line: variable-name
  description_other_display = false;
  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
    private event: EventService
  ) {
    this.event.isLogin.subscribe((res: boolean) => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }


  ngOnInit(): void {

    this.getSteps();
    this.formInit();
    const timeZoneList = moment.tz.names();
    // first time undefind value set without refresh so comment this sectio on 07.05.2020
    // this.form.patchValue({
    //   timezone: moment.tz.guess()
    // });

    // COUNTRY LIST
    this.getCountryList();
    // TIME ZONE
    if (this.form.value.timezone !== undefined) {
      this.timeZoneList = this.form.controls.timezone.valueChanges.pipe(
        startWith(''),
        map(state => state ? this.filterTimeZone(state, timeZoneList) : timeZoneList.slice())
      );
    }

    // BEST DESCRIPTION LIST
    this.getDescriptionList();

    // BUSINESS DESCRIPTION LIST
    this.getBusinessDescriptionList();
  }

  isExist(val) {
    if (_.isNull(val) || _.isEmpty(val) || _.isEmpty(val)) {
      return false;
    } else {
      return val;
    }
  }
  getSteps() {
    if (this.storage.getTempData() && this.storage.getTempData().step) {
      this.switchCase = this.storage.getTempData().step;
    } else {
      this.switchCase = 0;
    }
  }
  getUTCOffset(timezone: string) {
    return moment().tz(timezone).format('Z');
  }

  getCountryList() {
    this.api.get('user/country').subscribe((res: any) => {
      if (res.success) {
        const countryList = res.data;
        if (this.form.value.country !== undefined) {
          this.countryList = this.form.controls.country.valueChanges.pipe(
            startWith(''),
            map(state => {
              return state ? this.filterTimeZone(state, countryList) : countryList.slice();
            })
          );
        }
      }
    });
  }

  getDescriptionList() {
    this.api.get('user/bestDescription').subscribe((res: any) => {
      if (res.success) {
        const bestDescription = res.data;
        if (this.form.value.description !== undefined) {
          this.bestDescription = this.form.controls.description.valueChanges.pipe(
            startWith(''),
            map(state => state ? this.filterTimeZone(state, bestDescription) : bestDescription.slice())
          );
        }
      }
    });
  }

  getBusinessDescriptionList() {
    this.api.get('user/businessDescription').subscribe((res: any) => {
      if (res.success) {
        const businessDescription = res.data;
        if (this.form.value.business_description !== undefined) {
          this.businessDescription = this.form.controls.business_description.valueChanges.pipe(
            startWith(''),
            map(state => {
              return state ? this.filterTimeZone(state, businessDescription) : businessDescription.slice();
            })
          );
        }
      }
    });
  }

  private filterTimeZone(value: any, data) {
    return data.filter(state => {
      let filterValue = '';
      if (typeof value === 'string') {
        filterValue = value.toLowerCase();
      } else if (value.name) {
        filterValue = value.name.toLowerCase();
      }
      if (typeof state === 'string') {
        return state.toLowerCase().indexOf(filterValue) === 0;
      } else if (state.name) {
        return state.name.toLowerCase().indexOf(filterValue) === 0;
      }
    });
  }

  textfield(s: any) {
    if (s.name === 'Other') {
      this.business_description_other_display = true;
      this.form.addControl('business_description_other', new FormControl('', Validators.required));
    } else {
      this.business_description_other_display = false;
      this.form.removeControl('business_description_other');
    }

  }

  textfield2(s: any) {
    if (s.name === 'Other') {
      this.description_other_display = true;
      this.form.addControl('description_other', new FormControl('', Validators.required));
    } else {
      this.description_other_display = false;
      this.form.removeControl('description_other');
    }

  }


  formInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)]),
      // Validators.email
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      business_name: new FormControl('', Validators.required),

      // timezone: new FormControl('', Validators.required),
      //  business_description: new FormControl('', Validators.required),
      // description: new FormControl('', Validators.required),

      // last_name: new FormControl('', Validators.required),
      // first_name: new FormControl('', Validators.required),
      // country: new FormControl('', Validators.required),
      // city: new FormControl('', Validators.required),

    });
    if (this.switchCase === 1) {
      this.updateControls('add', ['timezone', 'business_description', 'description']);
      this.updateControls('remove', ['email', 'password', 'business_name']);
    } else if (this.switchCase === 2) {
      this.updateControls('add', ['last_name', 'first_name', 'country', 'city']);
      this.updateControls('remove', ['email', 'password', 'business_name']);
    }
  }


  createMyAccount(data: any) {


    if (this.form.valid) {
      data.step = 1;
      data.role = 'coach';
      this.api.post('user/register', data).subscribe((res: any) => {
        if (res.success) {
          this.api.alert(res.message, 'success');
          const authData: AuthModel = new AuthModel({
            token: res.token,
            username: res.data.first_name + ' ' + res.data.last_name,
            role: res.data.role,
            isLogin: res.data.step > 1
          });
          this.storage.setTempData({ step: 1 });
          this.storage.setUser(authData);
          this.switchCase = 1;
          this.updateControls('remove', ['email', 'password', 'business_name']);
          this.updateControls('add', ['timezone', 'business_description', 'description']);
          this.ngOnInit();
        } else {
          this.api.alert(res.message, 'error');
        }
      }, error => {
        this.api.alert(error.message, 'error');
      });

      // CALL A API HERE

    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched({ onlySelf: true });
      });
    }
  }

  updateControls(type, controls: Array<string>) {
    if (type === 'add') {
      for (const iterator of controls) {
        this.form.addControl(iterator, (new FormControl('', Validators.required)));
      }
    }
    if (type === 'remove') {
      for (const iterator of controls) {
        this.form.removeControl(iterator);
      }
    }
  }
  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }
  continue(switchCase: number, data: any) {
    if (this.form.valid) {
      if (switchCase === 2) {
        const postData = new FormData();
        postData.append('time_zone', data.time_zone);
        if (data.business_description.name === 'Other') {
          postData.append('business_other_details', data.business_description_other);
        }
        if (data.description.name === 'Other') {
          postData.append('best_other_details', data.description_other);
        }
        postData.append('business_descriptions_id', data.business_description.id);
        postData.append('best_descriptions_id', data.description.id);
        postData.append('step', switchCase.toString());

        this.api.postMultiData('user/profileUpdate', postData).subscribe((res: any) => {
          if (res.success) {
            this.storage.setTempData({ step: res.data.step });
            this.updateControls('remove', ['timezone', 'business_description', 'description']);
            this.updateControls('add', ['last_name', 'first_name', 'country', 'city']);
            this.getSteps();
            this.ngOnInit();
          }
        });
      } else if (switchCase === 3) {
        // CALL A API HERE WITH IMAGE UPLOAD
        const postData = new FormData();
        postData.append('first_name', data.first_name);
        postData.append('last_name', data.last_name);
        postData.append('country_id', data.country.id);
        postData.append('city', data.city);
        postData.append('step', '3');
        if (this.profileImageFile) {
          postData.append('profile_image', this.profileImageFile);
        }
        this.api.postMultiData('user/profileUpdate', postData).subscribe((res: any) => {
          if (res.success) {
            // this.storage.setTempData({ step: res.data[0].step });
            this.storage.clearTempData();
            this.storage.setDataField('username', res.data.first_name + ' ' + res.data.last_name);
            this.storage.setDataField('isLogin', res.data.step > 2);
            this.storage.setDataField('profileImage', this.isExist(res.data.profile_image) ? res.data.profile_image : '');
            this.event.setLoginEmmit(true);
            this.router.navigate(['/dashboard']);
            this.switchCase = 4;
          }
        });
      }
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched({ onlySelf: true });
      });
    }
  }

  profileImageChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.addEventListener('load', (e: any) => {
        this.profileImage = e.target.result;
      });
      reader.readAsDataURL(file);
    }
  }

  // LOGIN SUBMIT BUTON
  signup(formData: any) {
    if (this.form.valid) {

    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched({ onlySelf: true });
      });
    }
  }


  matchPassword(password: FormControl, confirmPassword: FormControl) {
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ noMatch: true });
    } else {
      confirmPassword.clearValidators();
      confirmPassword.updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.storage.clearTempData();
    if (this.switchCase < 4) {
      this.storage.clearUser();
    }
  }

}
