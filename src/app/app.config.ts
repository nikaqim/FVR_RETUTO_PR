import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from './translation.loader';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketIoConfigEnum } from './enums/socketIo';

const socketConfig:SocketIoConfig = {
  url: SocketIoConfigEnum.host, 
  options: {}
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),

    // SocketIoModule.forRoot(socketConfig).providers!, // ✅ this fixes WrappedSocket

    TranslateModule.forRoot({
        defaultLanguage: 'en',
        useDefaultLang: true,
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }).providers!
  ]
};