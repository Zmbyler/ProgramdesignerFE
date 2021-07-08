import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerCircleComponent } from './inner-circle.component';

describe('InnerCircleComponent', () => {
  let component: InnerCircleComponent;
  let fixture: ComponentFixture<InnerCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
