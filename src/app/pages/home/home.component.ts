import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DefaultComponent } from 'src/app/modal';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as htmlToText from 'html-to-text';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any;
  bannerData: any;
  blogDatas: any;
  homeData: any;
  trainingImageUrl = environment.BASE_IMAGE_URL + 'training_image/';

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private event: EventService,
    private http: HttpClient
  ) {
    this.homeData = undefined;

    this.bannerData = {
      title: 'Get Started Today!',
      // tslint:disable-next-line:max-line-length
      content: 'Our 3 week trial is only $99 and includes: an individualized assessment with Coach Zack, a custom training program and unlimited sessions over a 3 week period, during the adult training time slots.',
      images: ['./assets/images/banner.jpg'],
      buttonText: 'SIGN UP!',
      buttonLink: '/register'
    };
  }


  ngOnInit(): void {
    this.getHomeData();
    this.getBlogWp();
  }
  getHomeData() {
    this.api.get(`user/homepage`).subscribe((res: any) => {
      if (res.success) {
        this.homeData = res;
        this.createBanner(this.homeData.cms[0]);
      } else {
        this.api.alert(res.message, 'error');
      }
    }, error => {
      this.api.alert(error.message, 'error');
    });
  }
  createBanner(data: any) {
    this.bannerData.title = data.title;
    this.bannerData.content = data.short_description;
  }
  checkSpace(data: any) {
    if (data !== null) {
      const splitted = data.split(' ', 2);
      return `${splitted[0]}<span>${splitted[1]}</span>`;
    }
  }
  convertDesc(desc: any) {
    const text = htmlToText.fromString(desc, {
      wordwrap: 130
    });
    return text.slice(0, 130) + '...';
  }

  getBlogWp() {
    this.http.get(`https://newwebdev.wordpress-developer.us/best-e-zachary-blog/wp-json/wp/v2/posts?per_page=2`).subscribe((res: any) => {
    this.blogDatas = res;
    });
  }

  // OPEN MODAL 1
  // openModal(mtype) {
  //   this.dialog.open(DefaultComponent, {
  //     disableClose: true,
  //     width: '100%',
  //     maxWidth: '400px',
  //     data: { type: mtype }
  //   });
  // }
  // getEmpl() {
  //   this.event.setLoaderEmmit(false);
  //   const opts = { params: new HttpParams({ fromString: '_page=1&_limit=10' }) };
  //   this.api.get('employees', true, opts.params).subscribe(() => {

  //   }, (e) => {
  //   });
  // }

}
