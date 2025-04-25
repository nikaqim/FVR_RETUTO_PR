import { 
  ChangeDetectionStrategy,
  Component, 
  OnInit 
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { I18nService } from "../../../services/i18n.servise"

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSelectorComponent implements OnInit {
  selectedLanguage = 'en';

  constructor(public i18nService: I18nService) {}

  ngOnInit(): void {
    this.selectedLanguage = this.i18nService.getCurrentLanguage();
  }

  onLanguageChange(lang: string): void {
    this.i18nService.changeLanguage(lang);
    this.selectedLanguage = lang;
  }

}
