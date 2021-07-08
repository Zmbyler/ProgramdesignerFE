import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Banner } from 'src/app/global';
import { EventService } from 'src/app/services/event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnChanges {

  @Input() data: any;
  bannerData: Banner;
  isLogedIn: Observable<boolean>;
  constructor(
    private domSanitizer: DomSanitizer,
    private event: EventService
  ) {
    this.isLogedIn = this.event.isLogin;
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.data && this.data.images && this.data.images.length) {
      this.data.images = this.data.images.map(item => {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(item);
      });

      // this.domSanitizer.bypassSecurityTrustResourceUrl(this.data.images)
    }
    // this.bannerData = new Banner(this.data);
    this.bannerData = this.data;
  }

}
