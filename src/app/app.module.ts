import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './components/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


import { AppComponent } from './app.component';
import { MainScreenModule } from './components/main-screen/main-screen.module';
import { CyranoWalkthroughModule } from './components/cyrano-walkthrough/cyrano-walkthrough.module';
import { StartScreenModule } from './components/start-screen/start-screen.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const config:SocketIoConfig = {
  url: 'http://localhost:3000', options: {}
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    SharedModule,
    StartScreenModule,
    MainScreenModule,
    CyranoWalkthroughModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
