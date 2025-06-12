import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageId } from '../enums/storageId.enum';
import { LocalStorageService } from './local-storage.service';

import { AvailableLanguages } from '../config/i18n';

@Injectable({ providedIn: 'root' })
export class I18nService {
  availableLanguages = AvailableLanguages;

  private translateService = inject(TranslateService);
  private localStorage = inject(LocalStorageService);

  constructor() {
    this.translateService.addLangs(
      this.availableLanguages.map(lang => lang.code)
    );
    this.translateService.setDefaultLang('en');
  }

  public changeLanguage(lang: string): void {
    this.localStorage.setData(StorageId.LangConfig, lang);

    this.translateService.use(lang).subscribe(() => {});
  }

  public getCurrentLanguage(): string {
    const currentLang = this.localStorage.getData(StorageId.LangConfig);

    if (currentLang !== '') {
      this.translateService.use(currentLang);
      return currentLang;
    } else {
      this.translateService.use('en').subscribe(() => {});
      return 'en';
    }
  }
}
