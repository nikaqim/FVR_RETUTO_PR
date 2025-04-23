import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(translate: TranslateService) {
    console.log("register swiper");
    translate.setDefaultLang('en');
    translate.use('es');
  }
}
