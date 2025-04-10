import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Required for AoT
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  // return new TranslateHttpLoader(http, '/home/nikaqim/Workspace/Projects/FIVER/ryannvon-retuto/FVR_RETUTO_PR/src/assets/i18n/', '.json');
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}