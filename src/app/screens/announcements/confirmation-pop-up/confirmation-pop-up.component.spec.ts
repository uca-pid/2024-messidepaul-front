import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPopUpComponent } from './confirmation-pop-up.component';

describe('ConfirmationPopUpComponent', () => {
  let component: ConfirmationPopUpComponent;
  let fixture: ComponentFixture<ConfirmationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
