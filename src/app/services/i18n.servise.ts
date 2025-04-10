import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AvailableLanguages } from '../config/i18n';

@Injectable({ providedIn: 'root' })
export class I18nService {
    availableLanguages = AvailableLanguages;

    constructor(private translateService: TranslateService) {
        this.translateService.addLangs(this.availableLanguages.map(lang => lang.code));
        this.translateService.setDefaultLang('en');
    }

    public changeLanguage(lang: string): void {
        this.translateService.use(lang).subscribe(()=>{
            console.log("this.changeLanguage", lang);
        })
    }

    public getCurrentLanguage(): string {
        return this.translateService.currentLang || 'en';
    }
}