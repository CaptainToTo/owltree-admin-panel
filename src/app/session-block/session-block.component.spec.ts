import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionBlockComponent } from './session-block.component';

describe('SessionBlockComponent', () => {
  let component: SessionBlockComponent;
  let fixture: ComponentFixture<SessionBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
