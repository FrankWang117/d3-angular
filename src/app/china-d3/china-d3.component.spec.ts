import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinaD3Component } from './china-d3.component';

describe('ChinaD3Component', () => {
  let component: ChinaD3Component;
  let fixture: ComponentFixture<ChinaD3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChinaD3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinaD3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
