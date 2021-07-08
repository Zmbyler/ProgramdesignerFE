import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'underscore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-program-templates',
  templateUrl: './program-templates.component.html',
  styleUrls: ['./program-templates.component.scss']
})
export class ProgramTemplatesComponent implements OnInit {
  allTemplates: any;
  templateTypes: any;
  form: FormGroup;
  addNewToogle = false;
  individualSelected = false;
  templateId: any;
  goalId: any;
  datatoSend: any;
  mainTemplateData: any;
  programGoalData: any;
  editExistingTemplate = false;
  updateMainId: any;

  constructor(
    private api: ApiService
  ) {
    this.allTemplates = undefined;
    this.templateTypes = undefined;
    this.templateId = undefined;
    this.goalId = undefined;
    this.datatoSend = undefined;
    this.mainTemplateData = undefined;
    this.programGoalData = undefined;
  }

  ngOnInit(): void {
    this.formInit();
  }
  formInit() {
    this.form = new FormGroup({
      template_type_id: new FormControl('', Validators.required),
      program_goal_id: new FormControl('', Validators.required),
      program_name: new FormControl('', Validators.required),
    });
    this.getProgramTemplates();
  }
  getProgramTemplates() {
    this.api.getx(`user/getTemplate`).subscribe((res: any) => {
      if (res !== null) {
      if (res.success) {
        this.allTemplates = res.data;
        this.getTemplateTypeForAddNew();
      } else {
        this.api.alert(res.message, 'error');
      }
    }
    }, error => {
      this.api.alert(error.message, 'error');
    });
  }
  getTemplateTypeForAddNew() {
    this.api.getx(`user/getTemplateType`).subscribe((res: any) => {
      if (res !== null) {
      if (res.success) {
        this.templateTypes = res.data;
      } else {
        this.api.alert(res.message, 'error');
      }
    }
    }, error => {
      this.api.alert(error.message, 'error');
    });
  }
  editTemplate(templateId: any) {
    this.api.getx(`user/editTemplate/${templateId}`).subscribe((res: any) => {
      if (res !== null) {
      if (res.success) {
        this.updateMainId = res.data.id;
        this.mainTemplateData = _.findWhere(this.templateTypes, {id: res.data.template_type_id});
        this.programGoalData = _.findWhere(this.templateTypes[0].programgoal, {id: res.data.program_goal_id});
        this.addNewToogle = true;
        this.editExistingTemplate = true;
        if (this.programGoalData) {
          this.templateTypeChange(1); // to show program goal and add form validation
          setTimeout(() => {
            const editData = {
              template_type_id: this.mainTemplateData.name,
              program_goal_id: this.programGoalData.name,
              program_name: res.data.name
             };
            this.form.patchValue(editData);
            }, 1000);
        } else {
          setTimeout(() => {
            this.templateTypeChange(0); // to hide program goal and remove form validation
            this.individualSelected = false;
            const editData = {
              template_type_id: this.mainTemplateData.name,
              program_name: res.data.name
             };
            this.form.patchValue(editData);
            }, 1000);
        }
      } else {
        this.api.alert(res.message, 'error');
      }
    }
    }, error => {
      this.api.alert(error.message, 'error');
    });
  }
  deleteTemplate(templateId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You wont be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.api.getx(`user/deleteTemplate/${templateId}`).subscribe((res: any) => {
          if (res.success) {
            this.api.alert(res.message, 'success');
            this.getProgramTemplates();
          } else {
            this.api.alert(res.message, 'error');
          }
        }, error => {
          this.api.alert(error.message, 'error');
        });
      }
    });
  }
  addNewTemplateToogle() {
    this.addNewToogle = !this.addNewToogle;
    this.editExistingTemplate = false;
    this.clearForm();
  }
  templateTypeChange(id: any) {
    if (id === 1) {
      this.individualSelected = true;
      this.form.controls.program_goal_id.setValidators(Validators.required);
      this.form.controls.program_goal_id.updateValueAndValidity();
    } else {
      this.individualSelected = false;
      this.form.controls.program_goal_id.clearValidators();
      this.form.controls.program_goal_id.updateValueAndValidity();
    }
  }
  submitFormInit(templateData: any, type: any) {
    if (this.form.valid) {
      const data = _.findWhere(this.templateTypes, {name: templateData.template_type_id});
      this.templateId = data.id;
      if (this.templateId !== 1) {
        delete templateData.program_goal_id;
        this.datatoSend = {
          template_type_id: this.templateId,
          name: templateData.program_name
        };
      } else {
        const data1 = _.findWhere(this.templateTypes[0].programgoal, {name: templateData.program_goal_id});
        this.goalId = data1.id;
        this.datatoSend = {
          template_type_id: this.templateId,
          program_goal_id: this.goalId,
          name: templateData.program_name
        };
      }
      if (type === 'new') {
        this.sendDataToServer(this.datatoSend);
      } else if (type === 'update') {
        this.sendUpdatedDataToServer(this.datatoSend);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
  sendDataToServer(datatoSend: any) {
      this.api.postx('user/createTemplate', datatoSend).subscribe((res: any) => {
        if (res.success) {
          this.clearForm();
          this.api.alert(res.message, 'success');
          this.getProgramTemplates();
        } else {
          this.api.alert(res.message, 'error');
        }
      }, error => {
        this.api.alert(error.message, 'error');
      });
  }
  sendUpdatedDataToServer(datatoSend: any) {
    Object.assign(datatoSend, {id: this.updateMainId});
    this.api.postx(`user/updateTemplate`, datatoSend).subscribe((res: any) => {
      if (res.success) {
        this.clearForm();
        this.api.alert(res.message, 'success');
        this.addNewToogle = false;
        this.getProgramTemplates();
      } else {
        this.api.alert(res.message, 'error');
      }
    }, error => {
      this.api.alert(error.message, 'error');
    });
  }
  clearForm() {
    this.individualSelected = false;
    this.form.controls.program_goal_id.clearValidators();
    this.form.controls.program_goal_id.updateValueAndValidity();
    this.form.reset();
  }
}
