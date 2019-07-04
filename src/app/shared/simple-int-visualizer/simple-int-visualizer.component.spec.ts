import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleIntVisualizerComponent } from './simple-int-visualizer.component';

describe('SimpleIntVisualizerComponent', () => {
  let component: SimpleIntVisualizerComponent;
  let fixture: ComponentFixture<SimpleIntVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleIntVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleIntVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
