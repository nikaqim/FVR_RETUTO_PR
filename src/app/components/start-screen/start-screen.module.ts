import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { StartScreenComponent } from './start-screen.component';
import { StartScreenRoutingModule } from './start-screen-routing.module';

@NgModule({
  declarations: [StartScreenComponent],
  imports: [
    SharedModule,
    StartScreenRoutingModule
  ],
})
export class StartScreenModule { }
