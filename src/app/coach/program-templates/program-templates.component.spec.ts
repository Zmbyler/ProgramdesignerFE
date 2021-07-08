import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramTemplatesComponent } from './program-templates.component';

describe('ProgramTemplatesComponent', () => {
  let component: ProgramTemplatesComponent;
  let fixture: ComponentFixture<ProgramTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
