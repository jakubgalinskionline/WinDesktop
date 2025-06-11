import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDragDropDetailsComponent } from './table-drag-drop-details.component';

describe('TableDragDropDetailsComponent', () => {
  let component: TableDragDropDetailsComponent;
  let fixture: ComponentFixture<TableDragDropDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDragDropDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDragDropDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
