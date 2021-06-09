import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleFeatureComponent } from './sample-feature.component';

describe('SampleFeatureComponent', () => {
  let component: SampleFeatureComponent;
  let fixture: ComponentFixture<SampleFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
