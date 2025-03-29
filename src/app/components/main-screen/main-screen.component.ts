import { 
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ElementRef,
  AfterViewInit,
  ViewChild,
  SimpleChanges
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ButtonGroup } from '../shared/btn-group/btn-group.model';
import { BtnGroupService } from '../../services/btn.service';
import { BtnGroupConfig } from '../shared/btn-group/btn-group-config.model';
import { TranslateService } from '@ngx-translate/core';

import { WsService } from '../../services/ws.service';

import { CyranoTutorial } from '../../model/cyrano-walkthrough.model';
import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { WalkthroughConfigService } from '../../services/tuto.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent implements OnInit, OnDestroy {
  private subs = new Subscription();  

  buttonGroup :ButtonGroup[] = [];
  tutoData:CyranoTutorialConfig = {};

  panels:string[] = [];

  walkthroughActive:string = '';

  availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' }
  ];

  constructor(
    private wsService: WsService,
    private btnGroupService: BtnGroupService,
    private walkService: WalkthroughConfigService,
  ){
    // this.walkService.loadWalkthrough();
    this.btnGroupService.getButtonConfig().subscribe((data:BtnGroupConfig) => {
      this.buttonGroup = data['btngroup'];
    });
  }

  ngOnInit(): void {

    // for testing realtime update using websocket
    this.subs.add(
      this.wsService.listen('btnJsonUpdate').subscribe((msg:BtnGroupConfig) => {
        
        this.buttonGroup = typeof msg === 'string' ? JSON.parse(msg)['btngroup'] : msg['btngroup'];
      })
    );

    this.subs.add(
      this.walkService.onFinishLoadWalkThru().subscribe((data)=>{
        this.tutoData = this.walkService.getConfig();      
        this.panels = Object.keys(this.tutoData);
      })
    );
  }

  setBtnGroupReady(data: string){
    this.btnGroupService.notifyButtonGrpReady(data);
  }

  setActiveBtn(id: string){
    if(id !== ''){
      this.walkthroughActive = id;
      this.btnGroupService.notifyButtonGrpReady(id);
    } else {
      this.walkthroughActive = '';
    }
    
  }

  isActiveScreen(panelId:string):boolean{
    if(this.walkthroughActive !== ''){
      let screenId = this.walkService.getScreenById(this.walkService.getActiveId());
      return panelId === screenId
    }
    
    return false;
  }

  highlightAll(screenIsActive:boolean){
    
    return screenIsActive && !this.walkService.getById(this.walkService.getActiveId())?.focusBackdrop;
  }

  /**
   * Close walkthrough
   */
  closeWalkthrough(){
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
