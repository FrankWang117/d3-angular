import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloD3Component } from './hello-d3.component';

describe('HelloD3Component', () => {
  let component: HelloD3Component;
  let fixture: ComponentFixture<HelloD3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelloD3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloD3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
