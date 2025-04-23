import { 
  input,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  viewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import { ButtonsModule } from 'nextsapien-component-lib';
import { CommonModule } from '@angular/common';
import { CyranoWalkthroughComponent } from '../cyrano-walkthrough/cyrano-walkthrough.component';
import { BtnGroupComponent } from '../shared/btn-group/btn-group.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../shared/language-selector/language-selector.component';

import { SwiperConfig } from '../../config/swiper';
import { SwiperContainer } from 'swiper/element';


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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs = new Subscription();  
  private readonly swiperContainer = viewChild.required<ElementRef<SwiperContainer>>('allScreenView');
  

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
      this.wsService.listenBtnUpdate('btnJsonUpdate').subscribe((msg:IBtnGroupConfig) => {
        this.buttonGroup = typeof msg === 'string' ? JSON.parse(msg)['btngroup'] : msg['btngroup'];
      })
    );

    this.subs.add(
      this.walkService.onFinishLoadWalkThru().subscribe((data: CyranoTutorialConfig)=>{
        console.log("onFinishLoadWalkThru...");
        this.tutoData = { ...this.walkService.getConfig()};      
        this.panels = Object.keys(this.tutoData);
      })
    );

    this.subs.add(
      this.walkService.onMoveToSlide().subscribe((idx:number)=>{
        this.swiperContainer().nativeElement.swiper.slideTo(
          idx,
          0, 
          false
        );

        this.walkService.startTuto(this.walkService.getSteps()[0].id);
      })
    );
  }

  ngAfterViewInit(): void {
    // Initialize swiperJs
    if(this.panels.length > 0){
      const swiperElement = this.swiperContainer().nativeElement;
      console.log("swiperElement:",swiperElement);
      Object.assign(swiperElement, SwiperConfig);

      swiperElement.initialize();
      // setTimeout(() => {
      //   swiperElement.initialize();
      // }, 0);
      
    }
  }

  public onSlideChange(event:any){
    console.log("onSlideChange", event);
    console.log(
      "Current slide #:", 
      event["detail"][0].activeIndex, 
      this.walkService.getSteps().length);

    // this.walkService.swiperIsOnSlide(true);
    // this.swiperContainer().nativeElement.swiper.update();
  }

  onBeforeSlideChange(event:any){
    if(event["detail"][0].activeIndex >= this.walkService.getSteps().length-1) {
      // set slide to last slide once reached  
      console.log('Reached final slide');
      this.swiperContainer().nativeElement.swiper.slideTo(
        this.walkService.getSteps().length-1, 
        0, 
        false
      );
              
      this.swiperContainer().nativeElement.swiper.update();

      setTimeout(()=>{
        this.walkService.swiperIsOnSlide(true);
      }, 100)
      

    } 
  }

  public onSlideChangeEnd(event:any){
    if(event["detail"][0].activeIndex < this.walkService.getSteps().length) {
      console.log('Still under');
      this.walkService.swiperIsOnSlide(true);
    } else {
      console.log('Above limit');
    }
  }

  public onSlidePrevEnd(event:Event){
    this.walkService.swiperIsOnSlide(false);
  }

  public setBtnGroupReady(data: string): void{
    this.btnGroupService.notifyButtonGrpReady(data);
  }

  public setActiveBtn(id: string): void{
    if(id !== ''){
      console.log('Setiing active btn', id);
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
