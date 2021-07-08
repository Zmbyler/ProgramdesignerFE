import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import * as _ from 'underscore';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  profileImage: string;
  userName: string;
  IMAGE_URL: string;
  constructor(
    private storage: StorageService,
    private route: Router
  ) {
    this.IMAGE_URL = environment.BASE_IMAGE_URL;
  }

  ngOnInit(): void {
    const profileImage = this.storage.getDataField('profileImage');
    this.userName = this.storage.getDataField('username');
    if (this.isExist(profileImage) !== false) {
      this.profileImage = this.IMAGE_URL + `profile_image/${profileImage}`;
    }
  }
  isExist(val) {
    if (_.isNull(val) || _.isEmpty(val) || _.isEmpty(val)) {
      return false;
    } else {
      return val;
    }
  }
  forCreateData(type: any) {
    this.storage.setTempData({ dataType: type });
    this.route.navigate(['/build']);
  }
}
