import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { WalkthroughModule } from 'angular-walkthrough';
import { ButtonsModule } from 'nextsapien-component-lib';
import { BtnGroupComponent } from './btn-group/btn-group.component';
import { ButtonComponent } from './button/button.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
// import { CyranoTutorialModule } from 'cyranoTutorial';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    BtnGroupComponent,
    ButtonComponent,
    LanguageSelectorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    WalkthroughModule,
    HttpClientModule,
    MatIconModule,
    ButtonsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports:[
    CommonModule,
    TranslateModule,
    WalkthroughModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    ButtonsModule,
    BtnGroupComponent,
    ButtonComponent,
    LanguageSelectorComponent
  ]
})
export class SharedModule { }
