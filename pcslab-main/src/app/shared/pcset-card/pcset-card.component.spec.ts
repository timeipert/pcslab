import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcsetCardComponent } from './pcset-card.component';

describe('PcsetCardComponent', () => {
  let component: PcsetCardComponent;
  let fixture: ComponentFixture<PcsetCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcsetCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcsetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
