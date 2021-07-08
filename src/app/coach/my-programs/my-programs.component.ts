import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-programs',
  templateUrl: './my-programs.component.html',
  styleUrls: ['./my-programs.component.scss']
})
export class MyProgramsComponent implements OnInit {
  myPrograms: any;

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private route: Router
  ) {
    this.myPrograms = undefined;
  }

  ngOnInit(): void {
    this.getMyProgtams();
  }
  getMyProgtams() {
  this.api.getx(`user/getAllProgram`).subscribe((res: any) => {
    if (res !== null) {
    if (res.success) {
      this.myPrograms = res.data;
    } else {
      this.api.alert(res.message, 'error');
    }
  }
  }, error => {
    this.api.alert(error.message, 'error');
  });
  }
  editProgram(programId: any, type: any) {
    this.storage.setTempData({ dataType: type, program_id: programId });
    this.route.navigate(['/build']);
  }
  deleteProgram(programId: any) {
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
        // alert('delete api call here');
        this.api.getx(`user/deleteProgram/${programId}`).subscribe((res: any) => {
          if (res.success) {
            this.api.alert(res.message, 'success');
            this.getMyProgtams();
          } else {
            this.api.alert(res.message, 'error');
          }
        }, error => {
          this.api.alert(error.message, 'error');
        });
      }
    });
  }

}
