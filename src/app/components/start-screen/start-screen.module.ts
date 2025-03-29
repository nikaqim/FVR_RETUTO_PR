import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { StartScreenComponent } from './start-screen.component';
import { CyranoWalkthroughModule } from '../cyrano-walkthrough/cyrano-walkthrough.module';
@NgModule({
  declarations: [StartScreenComponent],
  imports: [
    SharedModule
  ]
})
export class StartScreenModule { }
