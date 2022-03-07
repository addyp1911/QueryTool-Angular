import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsAssignedComponent } from './tickets-assigned.component';

describe('TicketsAssignedComponent', () => {
  let component: TicketsAssignedComponent;
  let fixture: ComponentFixture<TicketsAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsAssignedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
