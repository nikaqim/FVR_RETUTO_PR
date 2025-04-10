import { 
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { ButtonsModule } from 'nextsapien-component-lib';
import { CommonModule } from '@angular/common';
import { CyranoWalkthroughComponent } from '../cyrano-walkthrough/cyrano-walkthrough.component';
import { BtnGroupComponent } from '../shared/btn-group/btn-group.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../shared/language-selector/language-selector.component';

import { Subscription } from 'rxjs';

import { ButtonGroup } from '../shared/btn-group/btn-group.model';
import { BtnGroupService } from '../../services/btn.service';
import { IBtnGroupConfig } from '../shared/btn-group/btn-group-config.model';

import { WsService } from '../../services/ws.service';

import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { WalkthroughConfigService } from '../../services/tuto.service';


@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonsModule,
    BtnGroupComponent,
    LanguageSelectorComponent,
    CyranoWalkthroughComponent
  ],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainScreenComponent implements OnInit, OnDestroy {
  private subs = new Subscription();  

  buttonGroup :ButtonGroup[] = [];
  tutoData:CyranoTutorialConfig = {};

  panels:string[] = [];

  walkthroughActive:string = '';

  constructor(
    private wsService: WsService,
    private btnGroupService: BtnGroupService,
    private walkService: WalkthroughConfigService,
  ){
    this.btnGroupService.getButtonConfig().subscribe((data:IBtnGroupConfig) => {
      this.buttonGroup = data['btngroup'];
    });
  }

  ngOnInit(): void {
    this.initSubs();
  }

  private initSubs(): void{
    // for testing realtime update using websocket
    this.subs.add(
      this.wsService.listen('btnJsonUpdate').subscribe((msg:IBtnGroupConfig) => {
        
        this.buttonGroup = typeof msg === 'string' ? JSON.parse(msg)['btngroup'] : msg['btngroup'];
      })
    );

    this.subs.add(
      this.walkService.onFinishLoadWalkThru().subscribe((data: CyranoTutorialConfig)=>{
        this.tutoData = { ...this.walkService.getConfig()};      
        this.panels = Object.keys(this.tutoData);
      })
    );
  }

  public setBtnGroupReady(data: string): void{
    this.btnGroupService.notifyButtonGrpReady(data);
  }

  public setActiveBtn(id: string): void{
    if(id !== ''){
      this.walkthroughActive = id;
      this.btnGroupService.notifyButtonGrpReady(id);
    } else {
      this.walkthroughActive = '';
    }
    
  }

  public isActiveScreen(panelId:string): boolean{
    if(this.walkthroughActive !== ''){
      let screenId = this.walkService.getScreenById(this.walkService.getActiveId());
      return panelId === screenId
    }
    
    return false;
  }

  public highlightAll(screenIsActive:boolean): boolean{
    
    return screenIsActive && !this.walkService.getById(this.walkService.getActiveId())?.focusBackdrop;
  }

  /**
   * Close walkthrough
   */
  public closeWalkthrough(): void {
    const container = document.querySelector('.wkt-finish-link');
    if (container) {
        (container as HTMLElement).click();

        this.walkService.closeTuto();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }


  
}
