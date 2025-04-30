import { Component, HostListener } from '@angular/core';
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
    translate.setDefaultLang('en');
    translate.use('es');
  }

    // Prevent Ctrl + Scroll
    @HostListener('window:wheel', ['$event'])
    onWheel(event: WheelEvent) {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    }
  
    // Prevent double-click
    @HostListener('window:dblclick', ['$event'])
    onDoubleClick(event: MouseEvent) {
      console.log('double click...');
      event.preventDefault();
    }
}
