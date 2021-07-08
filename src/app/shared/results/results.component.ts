import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import * as __ from 'underscore';
import { StorageService } from 'src/app/services/storage.service';
import * as html2pdf from 'html2pdf.js';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { EventService } from 'src/app/services/event.service';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  @Input() data: any;
  @Output() selctOption = new EventEmitter();
  @Output() submitForm = new EventEmitter();
  form: FormGroup;
  blockFocusList: any;
  athleteProfileList: any;
  seasonList: any;
  sportList: any;
  trainingAgeList: any;
  assessmentList: any;
  programGoalList: any;
  showProgramGoal = false;
  showDays = false;
  showProgramTemplate = false;
  showAthleteProfile = false;
  showSeason = false;
  showSport = false;
  dataType: any;
  dataTemplate: any;
  programControlData: any;
  programTemplateList: any;
  programChartDetails: any;
  currentTemplate: any;
  daysProgramChartDetails: any;
  filterData = {
    template_type_id  : null,
    program_goal_id : null,
  };
  programDetailsFilter = {
    main_template_id: null,
    program_goal_id : null,
    template_id: null,
    traiining_age: null,
    traiining_block: null,
    athlete_type: null,
    what_based: null,
    what_season: null
  };
  individualFormData = [];
  sgptFormData = [];
  athleteFormData = [];
  programId: any;
  lastProgramId: any;
  typeOfData: any;
  addNewAssessment: boolean;
  newAssesment: any;
  showIndividualPdf: boolean;
  showAtheletePdf: boolean;
  datasetReady: any;
  isPdfGenerate: boolean;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
    private eventService: EventService,
  ) {
    this.blockFocusList = undefined;
    this.athleteProfileList = undefined;
    this.seasonList = undefined;
    this.sportList = undefined;
    this.trainingAgeList = undefined;
    this.assessmentList = undefined;
    this.programGoalList = undefined;
    this.programChartDetails = undefined;
    this.currentTemplate = undefined;
    this.daysProgramChartDetails = undefined;
    this.programTemplateList = undefined;
    this.programId = 0;
    this.lastProgramId = undefined;
    this.addNewAssessment = false;
    this.programControlData = undefined;
    this.showIndividualPdf = false;
    this.showAtheletePdf = false;
  }

  ngOnInit() {
    this.getEditOrNew();
  }
  getEditOrNew() {
    if (this.storage.getTempData() && this.storage.getTempData().dataType) {
      this.typeOfData = this.storage.getTempData().dataType;
      this.getProgramId();
    }
  }
  getProgramId() {
    if (this.storage.getTempData() && this.storage.getTempData().program_id) {
      this.programId = this.storage.getTempData().program_id;
    } else {
      this.programId = 0;
    }
    this.formInit();
  }
  formInit() {
    this.form = new FormGroup({
      program_goal: new FormControl('', Validators.required),
      block_focus: new FormControl('', Validators.required),
      days: new FormControl('', Validators.required),
      athlete_profile: new FormControl('', Validators.required),
      season: new FormControl('', Validators.required),
      sport: new FormControl('', Validators.required),
      assessment_results: new FormControl('', Validators.required),
      training_level: new FormControl('', Validators.required),
      program_template: new FormControl('', Validators.required),
      program_name: new FormControl('', Validators.required)
    });
    this.getFormValue();
  }
  getFormValue() {
    this.api.getx(`user/fetchLastProgram/${this.programId}`).subscribe((res: any) => {
      if (res !== null) {
        if (res.success) {
          this.dataType = res.data.type;
          this.lastProgramId = res.data.id;
          this.dataTemplate = res.data.template;
          this.filterData.template_type_id = res.template;
          // newly added for filter
          this.programDetailsFilter.traiining_age = res.data.traiining_age;
          this.programDetailsFilter.traiining_block = res.data.traiining_block;
          this.programDetailsFilter.athlete_type = res.data.athlete_type;
          this.programDetailsFilter.what_based = res.data.what_based;
          this.programDetailsFilter.what_season = res.data.what_season;
          this.programDetailsFilter.program_goal_id = res.data.program_goal;

          setTimeout(() => {
            this.getProgramGoal().then(() => {
              this.getBlockFocus().then(() => {
                this.getAthleteProfileList().then(() => {
                  this.getSeasonList().then(() => {
                    this.getSportList().then(() => {
                      this.getTrainingAgeList().then(() => {
                        this.getAssessmentList().then(() => {
                          this.getProgramTemplateList(this.filterData).then(() => {
                            this.createFormAndPatchValue(res);
                            });
                          });
                      });
                    });
                  });
                });
              });
            });
          }, 1000);
      } else {
        this.api.alert(res.message, 'error');
      }
    }
    }, error => {
      this.api.alert(error.message, 'error');
    });
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
  programGoalDisplay(value?: number) {
    return value ? this.programGoalList.find(_ => _.id === value).name : undefined;
  }
  changeProgramGoal(value: any) {
    this.filterData.program_goal_id = value;
    this.programDetailsFilter.program_goal_id = value;
    this.form.controls.program_template.setValue('');
    this.programDetailsFilter.template_id = '';
    this.getProgramTemplateList(this.filterData).then(() => {
      this.getProgramChartList(this.programDetailsFilter);
    });
  }
  getBlockFocus() {
    const promise = new Promise((resolve, reject) => {
      this.api.get(`user/blockFocusList`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.blockFocusList = res.data;
            // console.log('blockFocus', this.blockFocusList);
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
  blockFocusDisplay(value?: number) {
    return value ? this.blockFocusList.find(_ => _.id === value).name : undefined;
  }
  getAthleteProfileList() {
    const promise = new Promise((resolve, reject) => {
      this.api.get(`user/athleteProfileList`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.athleteProfileList = res.data;
            // console.log('athleteProfileList', this.athleteProfileList);
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
  athleteProfileDisplay(value?: number) {
    return value ? this.athleteProfileList.find(_ => _.id === value).name : undefined;
  }
  getSeasonList() {
    const promise = new Promise((resolve, reject) => {
      this.api.get(`user/seasonList`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.seasonList = res.data;
            // console.log('seasonList', this.seasonList);
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
  seasonDisplay(value?: number) {
    return value ? this.seasonList.find(_ => _.id === value).name : undefined;
  }
  getSportList() {
    const promise = new Promise((resolve, reject) => {
      this.api.get(`user/sportList`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.sportList = res.data;
            // console.log('sportList', this.sportList);
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
  sportDisplay(value?: number) {
    return value ? this.sportList.find(_ => _.id === value).name : undefined;
  }
  getTrainingAgeList() {
    const promise = new Promise((resolve, reject) => {
      this.api.get(`user/trainingAgeList`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.trainingAgeList = res.data;
            // console.log('trainingAgeList', this.trainingAgeList);
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
  trainingAgeDisplay(value?: number) {
    return value ? this.trainingAgeList.find(_ => _.id === value).name : undefined;
  }
  getAssessmentList() {
    const promise = new Promise((resolve, reject) => {
      this.api.getx(`user/assessment`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.assessmentList = res.data;
            // console.log('assessmentList', this.assessmentList);
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
  assessmentDisplay(value?: number) {
    if (value !== undefined && value !== null) {
      this.addNewAssessment = false;
      return value ? this.assessmentList.find(_ => _.id === value).name : undefined;
    } else {
      this.addNewAssessment = true;
    }
  }
  addAssesment(newAssesmentForm: NgForm) {
    if (newAssesmentForm.valid) {
    this.api.postx('user/add-assessment', {name: newAssesmentForm.value.newAssesment}).subscribe((res: any) => {
      if (res.success) {
        this.addNewAssessment = false;
        this.api.alert(res.message, 'success');
        this.getAssessmentList();
      } else {
        this.api.alert(res.message, 'error');
      }
    }, error => {
      this.api.alert(error.message, 'error');
    });
    }
  }
  getProgramTemplateList(filterData: any) {
    const promise = new Promise((resolve, reject) => {
      this.api.postx(`user/programTemplateList`, filterData).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.programTemplateList = res.data;
            // console.log('programTemplateList', this.programTemplateList);
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
  changeProgramTemplate(value: any) {
    this.programDetailsFilter.template_id = value;
    this.getProgramChartList(this.programDetailsFilter);
  }
  programTemplateDisplay(value?: number) {
    return value ? this.programTemplateList.find(_ => _.id === value).name : undefined;
  }
  createFormAndPatchValue(res: any) {
    if (this.dataType === 'athlete') {
      this.programDetailsFilter.main_template_id = 3;
      if (this.programId !== 0) {
        this.getEditProgramDetails(this.programId); // first time call before filter on program edit
      } else {
        this.getProgramChartList(this.programDetailsFilter);
      }
      this.showAthleteProfile = true;
      this.showSeason = true;
      this.showSport = true;

      this.form.controls.athlete_profile.setValidators(Validators.required);
      this.form.controls.athlete_profile.updateValueAndValidity();
      this.form.controls.season.setValidators(Validators.required);
      this.form.controls.season.updateValueAndValidity();
      this.form.controls.sport.setValidators(Validators.required);
      this.form.controls.sport.updateValueAndValidity();

      this.form.controls.program_goal.clearValidators();
      this.form.controls.program_goal.updateValueAndValidity();
      this.form.controls.days.clearValidators();
      this.form.controls.days.updateValueAndValidity();
      this.form.controls.program_template.clearValidators();
      this.form.controls.program_template.updateValueAndValidity();

      if (this.storage.getTempData().dataType === 'new') {
        const athleteProfileData = __.findWhere(this.athleteProfileList, {name: res.data.what_based});
        const trainingLevelData = __.findWhere(this.trainingAgeList, {name: res.data.traiining_age.toString()});
        const athleteData = {
          athlete_profile: athleteProfileData.id,
          season: res.data.what_season,
          sport: res.data.athlete_type,
          training_level: trainingLevelData.id
        };
        this.form.patchValue(athleteData);
      } else if (this.storage.getTempData().dataType === 'edit') {
        this.form.patchValue(res.data);
      }

    } else if (this.dataType === 'gen-pop') {
      if (this.dataTemplate === 'Individual Templates') {
        this.programDetailsFilter.main_template_id = 1;
        if (this.programId !== 0) {
          this.getEditProgramDetails(this.programId); // if edit
        } else {
          this.getProgramChartList(this.programDetailsFilter); // if new
        }
        this.showProgramGoal = true;
        this.showDays = true;
        this.showProgramTemplate = true;

        this.form.controls.program_goal.setValidators(Validators.required);
        this.form.controls.program_goal.updateValueAndValidity();
        this.form.controls.days.setValidators(Validators.required);
        this.form.controls.days.updateValueAndValidity();
        this.form.controls.program_template.setValidators(Validators.required);
        this.form.controls.program_template.updateValueAndValidity();

        this.form.controls.athlete_profile.clearValidators();
        this.form.controls.athlete_profile.updateValueAndValidity();
        this.form.controls.season.clearValidators();
        this.form.controls.season.updateValueAndValidity();
        this.form.controls.sport.clearValidators();
        this.form.controls.sport.updateValueAndValidity();

        if (this.storage.getTempData().dataType === 'new') {
          const trainingLevelData = __.findWhere(this.trainingAgeList, {name: res.data.traiining_age.toString()});
          const IndividualizedData = {
            program_goal:  + res.data.program_goal,
            training_level: trainingLevelData.id
          };
          console.log('IndividualizedData', IndividualizedData);
          this.form.patchValue(IndividualizedData);
        } else if (this.storage.getTempData().dataType === 'edit') {
          this.form.patchValue(res.data);
        }

      } else if (this.dataTemplate === 'SGPT Templates') {
        this.programDetailsFilter.main_template_id = 2;
        this.showProgramTemplate = true;
        if (this.programId !== 0) {
          this.getEditProgramDetails(this.programId); // if edit
        } else {
          this.getProgramChartList(this.programDetailsFilter); // if new
        }

        this.form.controls.program_template.setValidators(Validators.required);
        this.form.controls.program_template.updateValueAndValidity();

        this.form.controls.program_goal.clearValidators();
        this.form.controls.program_goal.updateValueAndValidity();
        this.form.controls.days.clearValidators();
        this.form.controls.days.updateValueAndValidity();
        this.form.controls.athlete_profile.clearValidators();
        this.form.controls.athlete_profile.updateValueAndValidity();
        this.form.controls.season.clearValidators();
        this.form.controls.season.updateValueAndValidity();
        this.form.controls.sport.clearValidators();
        this.form.controls.sport.updateValueAndValidity();

        if (this.typeOfData === 'new') {
          const trainingLevelData = __.findWhere(this.trainingAgeList, {name: res.data.traiining_age.toString()});
          const SGPTData = {
            training_level: trainingLevelData.id
          };
          this.form.patchValue(SGPTData);
        } else if (this.typeOfData === 'edit') {
          this.form.patchValue(res.data);
        }
      }
    }
  }
  getProgramChartList(filterData: any) {
    const promise = new Promise((resolve, reject) => {
      this.api.postx(`user/fetchProgramChartDetails`, filterData).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.currentTemplate = res.data.template.toString(); // current Template id {like 1 for individual}
            this.programChartDetails = res.data;
            this.daysProgramChartDetails = Object.values(this.programChartDetails.second_portion);
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
  getEditProgramDetails(programId: any) {
    const promise = new Promise((resolve, reject) => {
      this.api.getx(`user/editProgramChartDetails/${programId}`).toPromise().then((res: any) => { // Success
        if (res !== null) {
          if (res.success) {
            this.currentTemplate = res.data.template.toString(); // current Template id {like 1 for individual}
            this.programChartDetails = res.data;
            this.daysProgramChartDetails = Object.values(this.programChartDetails.second_portion);
            // console.log('programChartDetails', this.programChartDetails);
            // console.log('daysProgramChartDetails', this.daysProgramChartDetails);
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
  formInputValueUpdate(item: any, key: any, value: any) {
    item[key] = value;
  }
  subCatChange(value: any, excersiceSub: any, category: any) {
    const subCatDetails = __.findWhere(excersiceSub, {name: value});
    Object.assign(category, {exercise_id : subCatDetails.id});
    // console.log('category', category);
  }
  setExcerciseValue(item: any) {
    // console.log('exercise_id', item.exercise_id);
    if (item.exercise_id === undefined) { // first time when fresh insert it will be undefined
      return item.subcategory.name;
    } else if (item.exercise_id === 0) { // for edit there will be exercise_id present
      return item.subcategory.name;
    } else {
      const subCatDetails = __.findWhere(item.subcategory.exercisesub, {id: item.exercise_id});
      return subCatDetails.name;
    }
  }
  submitFormInit(data: any) {
    if (this.form.valid) {
      const datasetReady = this.createDataSet(data);
      if (datasetReady) {
        this.sendDataToServer();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
  createDataSet(data: any) {
    // console.log('programChartDetails', this.programChartDetails);
    // console.log('daysProgramChartDetails', this.daysProgramChartDetails);
    // console.log('programControlData', (JSON.stringify(this.programControlData)));
    if (this.dataType === 'athlete') {
      this.athleteFormData = [];
      this.athleteFormData.push(this.programChartDetails.first_portion);
      this.daysProgramChartDetails.map((item: any, index: any) => {
          this.athleteFormData.push(item);
      });
      this.programControlData = {
        block_focus: data.block_focus,
        athlete_profile: data.athlete_profile,
        season: data.season,
        sport: data.sport,
        assessment_results: data.assessment_results,
        training_level: data.training_level,
        program_name: data.program_name,
        programChartData : this.athleteFormData,
        last_program_id: this.lastProgramId
      };
    } else if (this.dataType === 'gen-pop') {
      if (this.dataTemplate === 'Individual Templates') {
        this.individualFormData = [];
        this.individualFormData.push(this.programChartDetails.first_portion);
        this.daysProgramChartDetails.map((item: any, index: any) => {
          this.individualFormData.push(item);
        });
        this.programControlData = {
          program_goal: data.program_goal,
          block_focus: data.block_focus,
          days: data.days,
          training_level: data.training_level,
          assessment_results: data.assessment_results,
          program_template: data.program_template,
          program_name: data.program_name,
          programChartData : this.individualFormData,
          last_program_id: this.lastProgramId
      };
      } else if (this.dataTemplate === 'SGPT Templates') {
        this.sgptFormData = [];
        this.sgptFormData.push(this.programChartDetails.first_portion);
        this.daysProgramChartDetails.map((item: any, index: any) => {
          this.sgptFormData.push(item);
        });
        this.programControlData = {
          block_focus: data.block_focus,
          assessment_results: data.assessment_results,
          training_level: data.training_level,
          program_template: data.program_template,
          program_name: data.program_name,
          programChartData : this.sgptFormData,
          last_program_id: this.lastProgramId
      };
      }
    }
    if (this.programControlData) {
      return this.programControlData;
    } else {
      return false;
    }
  }
  generatePDF(data: any) {
    if (this.form.valid) {
      this.datasetReady = this.createDataSet(data);
      this.eventService.setCustomLoaderEmmit(true);
      Object.assign(
        this.datasetReady,
        {dataType: this.dataType},
        {dataTemplate: this.dataTemplate});
      setTimeout(() => {
          this.generateAndSavePDF(this.dataType === 'gen-pop' && this.dataTemplate === 'Individual Templates' ? 'portrait' : 'landscape');
        }, 1000);
    } else {
      this.form.markAllAsTouched();
    }
  }
  generateAndSavePDF(type: any) {
    const element = document.getElementById('pdfData');
    element.style.display = 'block';
    const opt = {
        margin: 5,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'mm', format: 'A4', orientation: type },
        };
    html2pdf().from(element).set(opt).toContainer().then(() => {
        element.style.display = 'none';
      }).toPdf().outputPdf('datauristring').then((res: any) => {
        this.datasetReady.pdf =  new File([this.dataURItoBlob(res)], `Generated.pdf`, { type: 'application/pdf' });
        // save data for program
        this.submitFormInit(this.form.value);
        this.eventService.setCustomLoaderEmmit(false);
      });
  }
  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI.replace(/^data:application\/pdf;filename=generated.pdf;base64,/, ''));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/pdf' });
    return blob;
  }
  sendDataToServer() {
    if (this.typeOfData === 'new') {
      this.api.postx('user/saveProgramControl', this.programControlData).subscribe((res: any) => {
        if (res.success) {
          if (!this.isPdfGenerate) {
            this.api.alert(res.message, 'success');
            this.router.navigate(['/my-programs']);
            this.form.reset();
          } else {
            this.datasetReady.previousProgramId = res.previousProgramId;
             // redirect to send pdf page
            this.submitForm.emit(this.datasetReady);
          }
        } else {
          this.api.alert(res.message, 'error');
        }
      }, error => {
        this.api.alert(error.message, 'error');
      });
    } else if (this.typeOfData === 'edit') {
      delete this.programControlData.last_program_id;
      Object.assign(this.programControlData, {program_id : this.programId});
      this.api.postx('user/updateProgramControl', this.programControlData).subscribe((res: any) => {
        if (res.success) {
          if (!this.isPdfGenerate) {
            this.api.alert(res.message, 'success');
            this.router.navigate(['/my-programs']);
            this.form.reset();
          } else {
            this.datasetReady.previousProgramId = res.previousProgramId;
             // redirect to send pdf page
            this.submitForm.emit(this.datasetReady);
          }
        } else {
          this.api.alert(res.message, 'error');
        }
      }, error => {
        this.api.alert(error.message, 'error');
      });
  }
  }
}
