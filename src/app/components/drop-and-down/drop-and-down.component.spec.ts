import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropAndDownComponent } from './drop-and-down.component';

describe('DropAndDownComponent', () => {
  let component: DropAndDownComponent;
  let fixture: ComponentFixture<DropAndDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropAndDownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropAndDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
