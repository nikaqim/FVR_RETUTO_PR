import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'fallbackTranslate',
  standalone: true,
  pure: true,
})
export class FallbackTranslatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(label: string, prefix: string = 'app.button'): string {
    const key = `${prefix}.${label}`;
    const translated = this.translate.instant(key);
    return translated === key ? label : translated;
  }
}
