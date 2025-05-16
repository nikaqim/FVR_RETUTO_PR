import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWalkthroughComponent } from './custom-walkthrough.component';

describe('CustomWalkthroughComponent', () => {
  let component: CustomWalkthroughComponent;
  let fixture: ComponentFixture<CustomWalkthroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomWalkthroughComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomWalkthroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
