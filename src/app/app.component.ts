import { Component, HostListener, inject } from '@angular/core';
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
  private translate = inject(TranslateService);

  constructor() {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
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
    event.preventDefault();
  }
}
