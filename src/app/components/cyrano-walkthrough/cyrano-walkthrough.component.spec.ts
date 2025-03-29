import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyranoWalkthroughComponent } from './cyrano-walkthrough.component';

describe('CyranoWalkthroughComponent', () => {
  let component: CyranoWalkthroughComponent;
  let fixture: ComponentFixture<CyranoWalkthroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CyranoWalkthroughComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CyranoWalkthroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
