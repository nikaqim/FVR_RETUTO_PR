import { Component, OnInit } from '@angular/core';
import { I18nService } from "../../../services/i18n.servise"

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent implements OnInit {
  selectedLanguage = 'en';

  constructor(public i18nService: I18nService) {}

  ngOnInit(): void {
      this.selectedLanguage = this.i18nService.getCurrentLanguage();
  }

  onLanguageChange(lang: string): void {
    console.log('change lang', lang);
      this.i18nService.changeLanguage(lang);
      this.selectedLanguage = lang;
  }

}
