import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  aboutUs: any;

  constructor(
    private api: ApiService
  ) {
    this.aboutUs = undefined;
  }

  ngOnInit(): void {
    this.getAboutUsData();
  }
  getAboutUsData() {
    this.api.get(`user/cms/${'about-us'}`).subscribe((res: any) => {
      if (res.success) {
        this.aboutUs = res.data;
      } else {
        this.api.alert(res.message, 'error');
      }
    }, error => {
      this.api.alert(error.message, 'error');
    });
  }

}
