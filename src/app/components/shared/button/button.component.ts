import { 
  ChangeDetectionStrategy,
  Component, 
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonsModule } from 'nextsapien-component-lib';
import { CommonModule } from '@angular/common';

import { Button } from './button.model';
import { WalkthroughConfigService } from '../../../services/tuto.service';
import { BtnGroupService } from '../../../services/btn.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  imports: [
    CommonModule,
    ButtonsModule,
    TranslateModule
  ],
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnChanges {
  @Input() btnSetting:Button;
  @Input() screenId:string = '';

  buttonActions: { [key:string] : () => void } = {
    "openHelp": () => this.openTutorial(),
    "exitTutorial": () => this.exitTutorial()
  }

  constructor(
    private router: Router,
    private btnService: BtnGroupService,
    private walkService: WalkthroughConfigService,
    private translate: TranslateService
  ){
    this.btnSetting = new Button("","","","", "",false)
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['btnSetting.id']){
    }    
  }


  public buttonClicked(type: string): void{
    const action = this.buttonActions[type];
    
    if (action) {
      action();
    }
  }

  public getTranslatedLabel(label: string): string {
    const key = `app.button.${label}`;
    const translation = this.translate.instant(key);
    return translation === key ? label : translation; // ✅ Fallback to `label`
  }

  private openTutorial(): void {
    console.log("open tutorial...");
    this.walkService.scrollIntoView(this.walkService.getScreenById('walk1'));
    this.walkService.startTuto('walk1');
  }

  private  exitTutorial(): void {
    this.router.navigate(['/']);
  }
}
