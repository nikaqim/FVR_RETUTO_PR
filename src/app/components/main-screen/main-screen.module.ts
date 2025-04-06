import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ButtonsModule } from 'nextsapien-component-lib';

import { MainScreenRoutingModule } from './main-screen-routing.module';

import { MainScreenComponent } from './main-screen.component';
import { CyranoWalkthroughModule } from '../cyrano-walkthrough/cyrano-walkthrough.module';

@NgModule({
  declarations: [MainScreenComponent],
  imports: [
    CommonModule,
    MainScreenRoutingModule,
    SharedModule,
    ButtonsModule,
    CyranoWalkthroughModule
  ], 
  bootstrap: [MainScreenComponent]
})
export class MainScreenModule { }
