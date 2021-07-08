import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'default';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    this.loadCustomIcon();
    // const URL = window.URL;
    // window.addEventListener('unload', () => {
    // });
  }


  loadCustomIcon() {
    this.matIconRegistry.addSvgIcon(
      'admin-login',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/man.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'calendar',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/calendar.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'comment',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/comment1.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'down-arrow',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/down-arrow.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'user-login',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/user.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'pin',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/pin.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'phone',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/phone.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'plane',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/plane.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'login-user',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/login-user.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'password',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/password.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'team',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/team.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'soccer',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/soccer.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'baseball',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/baseball.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'volleyball',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/volleyball.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'basketball',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/basketball.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'swim',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/swim.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'tennis',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/tennis.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'hockey-stick',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/hockey-stick.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'football',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/football.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'star',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/star.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'healthy',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/healthy.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'strength',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/strength.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'arm',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/arm.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'stadium',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/stadium.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'speed',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/speed.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'tick',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/tick.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'profileImage',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/user3.svg')
    );










  }

}
