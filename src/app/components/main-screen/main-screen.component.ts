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
  NgZone
} from '@angular/core';

import { ButtonsModule } from 'nextsapien-component-lib';
import { CommonModule } from '@angular/common';
import { CyranoWalkthroughComponent } from '../cyrano-walkthrough/cyrano-walkthrough.component';
import { BtnGroupComponent } from '../shared/btn-group/btn-group.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../shared/language-selector/language-selector.component';

import { SwiperConfig } from '../../config/swiper';
import { SwiperContainer } from 'swiper/element';


import { Subscription, fromEvent, debounceTime } from 'rxjs';

import { ButtonGroup } from '../shared/btn-group/btn-group.model';
import { BtnGroupService } from '../../services/btn.service';
import { IBtnGroupConfig } from '../shared/btn-group/btn-group-config.model';

import { WsService } from '../../services/ws.service';

import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { WalkthroughConfigService } from '../../services/tuto.service';
import { 
  WalkthroughComponent,
  WalkthroughNavigate,
  WalkthroughService,
} from 'angular-walkthrough';

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

  onSwiping: boolean = false;

  panels:string[] = [];

  walkthroughActive:string = '';

  constructor(
    private zone: NgZone,
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
        this.tutoData = { ...this.walkService.getConfig()};      
        this.panels = Object.keys(this.tutoData);

        if(this.panels.length > 0){
          const swiperElement = this.swiperContainer().nativeElement;
          Object.assign(swiperElement, SwiperConfig);
    
          swiperElement.initialize();
        }
      })
    );

     this.subs.add(
      WalkthroughComponent.onNavigate
      .subscribe((comt: WalkthroughNavigate) => {
        this.onSwiping = false;
      })
    );

    this.subs.add(
      this.walkService.isOnTriggerSwiper().subscribe((next:boolean) => {
        let currentIdx = this.swiperContainer().nativeElement.swiper.activeIndex;

        if(!this.onSwiping){
          this.onSwiping = true;
          
          this.walkService.setSwiping(this.onSwiping);

          if(next){
            let moveToPosition = currentIdx +1 ;
            this.swiperContainer().nativeElement.swiper.slideTo(
              moveToPosition
            );
  
          } else {
            let moveToPosition = currentIdx -1 ;
            this.swiperContainer().nativeElement.swiper.slideTo(
              moveToPosition
            );
  
          }
        }
        
      })
    )

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
    const swiperElement: HTMLElement = this.swiperContainer().nativeElement;

    // on swipe transition - draw arrow
    fromEvent(swiperElement, 'transitionend')  // lowercase native event!
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.zone.run(() => {
          this.walkService.setSwiping(false);
          this.walkService.setDrawArrowSubject(true);
        });
      });
  }

  public onSwiperMove(event:any){
    if(!SwiperConfig.centeredSlides){
      if(window.innerWidth > 641){
        if(event.detail[1].movementX > 0){
          if(!this.onSwiping){

            this.onSwiping = true;
            this.walkService.setSwiping(this.onSwiping);
            

            this.swiperContainer().nativeElement.swiper.slideTo(
              event["detail"][0].activeIndex-1, 
              0, 
              false
            );
    
            this.swiperContainer().nativeElement.swiper.update();
    
            setTimeout(()=>{
              this.walkService.swiperIsOnSlide(false);
            }, 200)
            
          }
        } else {
          
          if(!this.onSwiping){

            this.onSwiping = true;
            this.walkService.setSwiping(this.onSwiping);
            

            this.swiperContainer().nativeElement.swiper.slideTo(
              event["detail"][0].activeIndex+1, 
              0, 
              false
            );
    
            this.swiperContainer().nativeElement.swiper.update();
    
            setTimeout(()=>{
              this.walkService.swiperIsOnSlide(true);
            }, 200)
    
          }
          
        }
      }
    }
  }

  public onSlideChange(event:any){
  }

  onBeforeSlideChange(event:any){
    this.onSwiping = true;
    this.walkService.setSwiping(true);
    
    // set slide to last slide once reached  
    if(event["detail"][0].activeIndex >= this.walkService.getSteps().length-1) {
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
    this.onSwiping = false;
    if(event["detail"][0].activeIndex < this.walkService.getSteps().length) {
      this.walkService.swiperIsOnSlide(true);
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
      this.walkthroughActive = id;
      this.btnGroupService.notifyButtonGrpReady(id);
    } else {
      this.walkthroughActive = '';
    }
    
  }

  public isActiveScreen(panelId:string): boolean{
    if(this.walkthroughActive !== ''){
      let screenId = this.walkService.getScreenById(this.walkService.getActiveId()).replace(' ','');
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
