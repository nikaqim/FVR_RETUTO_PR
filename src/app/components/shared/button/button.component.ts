import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressOffsetPipe } from '../../../pipe/progress-offset.pipe';
import { FallbackTranslatePipe } from '../../../pipe/fallback-translate.pipe';
import { ButtonsModule } from 'nextsapien-component-lib';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { Button } from './button.model';
import { TutoService } from '../../../services/tuto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    ButtonsModule,
    TranslateModule,
    ProgressOffsetPipe,
    FallbackTranslatePipe,
  ],
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  private _screenId: string = '';
  public sanitizedScreenId: string = '';
  public sanitizedLowercaseScreenId: string = '';

  @Input() btnSetting: Button = new Button('', '', '', '', '', false);

  @Input()
  set screenId(value: string) {
    this._screenId = value;
    const sanitized = value.replace(/\s+/g, '');
    this.sanitizedScreenId = sanitized;
    this.sanitizedLowercaseScreenId = sanitized.toLowerCase(); // 🔽 this handles both
  }

  get screenId(): string {
    return this._screenId;
  }

  private buttonActions: { [key: string]: () => void } = {
    openHelp: () => this.openTutorial(),
    exitTutorial: () => this.exitTutorial(),
  };

  private router = inject(Router);
  private walkService = inject(TutoService);
  private translate = inject(TranslateService);
  constructor() {}

  public buttonClicked(type: string): void {
    if (this.buttonActions[type]) {
      this.buttonActions[type]();
    }
  }

  public applyTitle(btnSetting: Button): boolean {
    if (!btnSetting.title || btnSetting.hideTitle) {
      return false;
    }

    return true;
  }

  public getTranslatedLabel(label: string): string {
    const key = `app.button.${label}`;
    const translation = this.translate.instant(key);
    return translation === key ? label : translation; // ✅ Fallback to `label`
  }

  private openTutorial(): void {
    this.walkService.closeTuto();

    setTimeout(() => {
      this.walkService.setWalkStatus(true);
      this.walkService.moveToSlide(0);
    }, 100);
  }

  private exitTutorial(): void {
    this.router.navigate(['/']);
  }
}
