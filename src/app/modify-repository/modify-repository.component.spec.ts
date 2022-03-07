import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyRepositoryComponent } from './modify-repository.component';

describe('ModifyRepositoryComponent', () => {
  let component: ModifyRepositoryComponent;
  let fixture: ComponentFixture<ModifyRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyRepositoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
