import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  username: string;
  role: any;

  constructor(
    private event: EventService,
    private storage: StorageService,
  ) {
    this.event.isLogin.subscribe((res: boolean) => {
      this.isLoggedIn = res;
      this.username = this.storage.getDataField('username');
      if (this.storage.getDataField('role') !== undefined) {
        this.role = this.storage.getDataField('role');
      }
    });
  }

  ngOnInit(): void {
  }
  mobileTrigger(type: string, navigation: Element) {
    navigation.classList.add(type);
    if (type === 'show') {
      navigation.classList.remove('hidden');
    }
    if (type === 'hidden') {
      navigation.classList.remove('show');
    }
  }
  logout() {
    this.storage.clearUser();
    this.event.setLoginEmmit(false);
  }
}
