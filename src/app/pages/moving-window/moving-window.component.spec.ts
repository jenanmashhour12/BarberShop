import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingWindowComponent } from './moving-window.component';

describe('MovingWindowComponent', () => {
  let component: MovingWindowComponent;
  let fixture: ComponentFixture<MovingWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovingWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
