import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavIconComponent } from './user-nav-icon.component';

describe('UserNavIconComponent', () => {
  let component: UserNavIconComponent;
  let fixture: ComponentFixture<UserNavIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNavIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNavIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
