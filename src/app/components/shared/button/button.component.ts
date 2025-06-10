import { 
  ChangeDetectionStrategy,
  Component, 
  Input
} from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressOffsetPipe } from '../../../pipe/progress-offset.pipe';
import { FallbackTranslatePipe } from '../../../pipe/fallback-translate.pipe';
import { ButtonsModule } from 'nextsapien-component-lib';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { Button } from './button.model';
import { TutoService } from '../../../services/tuto.service';
import { BtnGroupService } from '../../../services/btn.service';
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
    FallbackTranslatePipe
  ],
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() btnSetting:Button = new Button("","","","", "",false);
  @Input() screenId:string = '';

  private buttonActions: { [key:string] : () => void } = {
    "openHelp": () => this.openTutorial(),
    "exitTutorial": () => this.exitTutorial()
  }

  constructor(
    private router: Router,
    private btnService: BtnGroupService,
    private walkService: TutoService,
    private translate: TranslateService
  ){

  }

  public buttonClicked(type: string): void{
    if (this.buttonActions[type]) {  
      this.buttonActions[type]();
    }
  }

  public applyTitle(btnSetting:Button):boolean {
    if(!btnSetting.title || btnSetting.hideTitle){
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

    setTimeout(()=>{
      this.walkService.setWalkStatus(true);
      this.walkService.moveToSlide(0);
    },100)
    
  }

  public getProgressOffset(progress: number, totalLength: number = 100):number {
    return 100 - progress
  }

  private  exitTutorial(): void {
    this.router.navigate(['/']);
  }
}
