import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class I18nService {
    availableLanguages = [
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'Français' },
        { code: 'es', label: 'Español' }
    ];

    constructor(private translateService: TranslateService) {
        this.translateService.addLangs(this.availableLanguages.map(lang => lang.code));
        this.translateService.setDefaultLang('en');
    }

    changeLanguage(lang: string): void {
        this.translateService.use(lang);
    }

    getCurrentLanguage(): string {
        return this.translateService.currentLang || 'en';
    }
}