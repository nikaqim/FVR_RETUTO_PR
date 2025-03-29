import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyranoWalkthroughComponent } from './cyrano-walkthrough.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CyranoWalkthroughComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CyranoWalkthroughComponent
  ]
})
export class CyranoWalkthroughModule { }
