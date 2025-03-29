import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ButtonsModule } from 'nextsapien-component-lib';

import { MainScreenComponent } from './main-screen.component';
// import { TutoWalkthroughModule } from '../tuto-walkthrough/tuto-walkthrough.module';
import { CyranoWalkthroughModule } from '../cyrano-walkthrough/cyrano-walkthrough.module';

@NgModule({
  declarations: [MainScreenComponent],
  imports: [
    CommonModule,
    SharedModule,
    ButtonsModule,
    CyranoWalkthroughModule
  ], 
  bootstrap: [MainScreenComponent]
})
export class MainScreenModule { }
