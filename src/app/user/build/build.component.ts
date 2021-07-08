import { Component, OnInit, HostListener, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import * as _ from 'underscore';
@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.scss']
})
export class BuildComponent implements OnInit {
  switchCase: number;
  data: any;
  form: FormGroup;
  assessmentResultFrom: FormGroup;
  isSubmitted = false;
  typeOfData: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  assignTo: any;
  formValue: any;
  assesmentResult: any;
  filterAssesment = [];
  sportList: any;
  seasonList: any;
  programGoalList: any;

  constructor(
    private api: ApiService,
    private storage: StorageService,
    public location: Location

  ) {
    this.assignTo = [];
    this.filterAssesment = [];
  }

  ngOnInit(): void {
    this.formInit();
    this.getEditOrNew();
    this.getProgramGoal().then(() => {
    });
    this.getSportList().then(() => {
      this.getSeasonList().then(() => {
        this.getAssesmentResult().then(() => {
        });
      });
  });
  }

  formInit() {
    this.form = new FormGroup({
      program_name: new FormControl('', [Validators.required]),
      assign_to: new FormControl('', [Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
      notes: new FormControl('')
    });
  }

  getEditOrNew() {
    if (this.storage.getTempData() && this.storage.getTempData().dataType) {
      this.typeOfData = this.storage.getTempData().dataType;
      if (this.storage.getTempData().dataType === 'new') {
        this.switchCase = 0; // if new start here
        this.data = {};
      } else if (this.storage.getTempData().dataType === 'edit') {
        this.switchCase = 9; // if edit then go to app-result
      }
    }
  }

  getSportList() {
    const promise = new Promise((resolve, reject) => {
      this.api.get(`user/sportList`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.sportList = res.data;
          } else {
            this.api.alert(res.message, 'error');
          }
        }
        resolve();
        },
        (msg: any) => { // Error
          reject(msg);
        });
    });
    return promise;
  }

  getSeasonList() {
    const promise = new Promise((resolve, reject) => {
      this.api.get(`user/seasonList`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.seasonList = res.data;
          } else {
            this.api.alert(res.message, 'error');
          }
        }
        resolve();
        },
        (msg: any) => { // Error
          reject(msg);
        });
    });
    return promise;
  }

  getAssesmentResult() {
    const promise = new Promise((resolve, reject) => {
      this.api.getx(`user/assessmentResult`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.assesmentResult = res.data;
            const group = {};
            this.assesmentResult.map((item: any)  => {
              group[item.slug] = new FormControl('', [Validators.required]);
            });
            this.assessmentResultFrom = new FormGroup(group);
          } else {
            this.api.alert(res.message, 'error');
          }
        }
        resolve();
        },
        (msg: any) => { // Error
          reject(msg);
        });
    });
    return promise;
  }

  getProgramGoal() {
    const promise = new Promise((resolve, reject) => {
      this.api.get(`user/programGoalList`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.programGoalList = res.data;
            // console.log('programGoalList', this.programGoalList);
          } else {
            this.api.alert(res.message, 'error');
          }
        }
        resolve();
        },
        (msg: any) => { // Error
          reject(msg);
        });
    });
    return promise;
  }

  selectOption(switchCase: number, key: string, value: any, item?: any ) {
    console.log(switchCase, key, value, item);
    if (this.switchCase !== switchCase) {
      const maincontainer = document.getElementById('_maincontainer');
      maincontainer.scrollIntoView({ behavior: 'smooth' });
    }
    // if gen-pop then select type line individual or sgpt and api hitted from here
    if (switchCase === 8) {
      this.switchCase = switchCase;
      this.data[key] = value;
      this.sendDataToServer();
      // assement result form dynamic data
    } else if (switchCase === 6) {
      this.switchCase = switchCase;
      if (item !== undefined) {
        const data = {
          id: item.id,
          slug: item.slug,
          option: value
        };
        this.filterAssesment.push(data);
        console.log('this.filterAssesment', this.filterAssesment);
      } else {
        this.data[key] = value;
      }
    // if generate pdf option selected
    } else if (switchCase === 10) {
      this.switchCase = switchCase;
      this.form.patchValue(value);
      if (value.dataType === 'athlete') {
        this.formValue = value;
      } else if (value.dataType === 'gen-pop') {
        if (value.dataTemplate === 'Individual Templates') {
          this.formValue = value;
        } else if (value.dataTemplate === 'SGPT Templates') {
          this.formValue = value;
        }
      }
    // if athelete or orther than gen-pop and pdf option
    } else {
      this.switchCase = switchCase;
      this.data[key] = value;
    }
  }

  addMemberForEmail(event: any) {
    if ((event.value || '').trim() && !this.form.controls.assign_to.hasError('pattern')) {
      // tslint:disable-next-line:no-unused-expression
      !_.contains(this.assignTo, event.value.trim()) ? this.assignTo.push(event.value.trim()) : '';
      this.form.patchValue({assign_to: ''});
    }
  }

  removeMemberForEmail(data) {
    const index = this.assignTo.indexOf(data);
    if (index >= 0) {
      this.assignTo.splice(index, 1);
    }
  }

  resultsChange(event) {
    if (event.PDF) {
    }
  }

  assesment() {
    this.isSubmitted = true;
    if (!this.assessmentResultFrom.valid) {
      return false;
      } else {
        if (this.data.type === 'athlete') {
          this.switchCase = 8;
          // if athlete then api hitted from here
          this.sendDataToServer();
        }
        if (this.data.type === 'gen-pop') {
          this.switchCase = 7;
        }
        const maincontainer = document.getElementById('_maincontainer');
        maincontainer.scrollIntoView({ behavior: 'smooth' });
      }
  }

  sendDataToServer() {
    Object.assign(this.data, {assessment: this.filterAssesment});
    this.api.postx('user/saveUserProgram', this.data).subscribe((res: any) => {
      if (res.success) {
        this.api.alert(res.message, 'success');
        this.switchCase = 9;
      } else {
        this.api.alert(res.message, 'error');
      }
    }, error => {
      this.api.alert(error.message, 'error');
    });
  }

  submitDetailsForMail(data: any) {
    if (this.form.valid) {
      if (this.assignTo.length > 0) {
        const postData = new FormData();
        postData.set('program_controls_id', this.formValue.previousProgramId);
        // postData.set('program_controls_id', this.formValue.last_program_id);
        for (let index = 0; index < this.assignTo.length; index++) {
          postData.append(`email[${index}]`, this.assignTo[index]);
        }
        postData.set('name', data.program_name);
        postData.set('notes', data.notes);
        postData.set('pdf', this.formValue.pdf);

        this.api.postMultiData(`user/ProgramTemplatePdf`, postData).toPromise().then((res: any) => { // Success
          if (res !== null) {
            if (res.success) {
              this.location.back();
              this.api.alert(res.message, 'success');
            } else {
              this.api.alert(res.message, 'error');
            }
          }
          },
          (msg: any) => { // Error
            this.api.alert(msg, 'error');
          });
      } else {
        this.api.alert('Please add Email address!', 'error');
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
