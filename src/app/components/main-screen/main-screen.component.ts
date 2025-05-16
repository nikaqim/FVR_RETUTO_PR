import { 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgZone
} from '@angular/core';

import { ButtonsModule } from 'nextsapien-component-lib';
import { CommonModule } from '@angular/common';
import { CyranoWalkthroughComponent } from '../cyrano-walkthrough/cyrano-walkthrough.component';
import { CustomWalkthroughComponent } from '../custom-walkthrough/custom-walkthrough.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { BtnGroupComponent } from '../shared/btn-group/btn-group.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../shared/language-selector/language-selector.component';

import { SwiperConfig } from '../../config/swiper';
import { SwiperContainer } from 'swiper/element';

import { Subscription, fromEvent, debounceTime, every } from 'rxjs';

import { ButtonGroup } from '../shared/btn-group/btn-group.model';
import { BtnGroupService } from '../../services/btn.service';
import { IBtnGroupConfig } from '../shared/btn-group/btn-group-config.model';

// import { WsService } from '../../services/ws.service';

import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { WalkthroughConfigService } from '../../services/tuto.service';

import { transition } from '@angular/animations';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonsModule,
    BtnGroupComponent,
    LanguageSelectorComponent,
    CyranoWalkthroughComponent,
    CustomWalkthroughComponent,
    NavigationComponent
  ],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs = new Subscription();  
  @ViewChild('allScreenView', { static: false }) swiperContainer!: ElementRef<SwiperContainer>;

  buttonGroup :ButtonGroup[] = [];
  tutoData:CyranoTutorialConfig = {};

  onSwiping: boolean = false;

  panels:string[] = [];
  activeScreen:string = "";

  walkthroughActive:string = '';
  walkthroughActiveStepsIdx: number = 0;

  onButtonTrigger:boolean = false
  onButtonDirection:string = "next";

  constructor(
    private zone: NgZone,
    private btnGroupService: BtnGroupService,
    private walkService: WalkthroughConfigService,
    private cd: ChangeDetectorRef
  ){

    this.btnGroupService.getButtonConfig().subscribe((data:IBtnGroupConfig) => {
      this.buttonGroup = data['btngroup'];
    });
  }

  ngOnInit(): void {
    this.initSubs();
  }

  private initSubs(): void{

    // for navigation trigger swiper
    this.subs.add(
      this.walkService.isOnTriggerSwiper()
      .pipe(debounceTime(100)).subscribe((next:boolean) => {
        
        let step = this.walkService.getCurrentStep();
        let currentIdx = step ? this.walkService.getStepIdxFromId(step.id) : null;

        console.log("isonTriggerSwiper", next, currentIdx);
        if((currentIdx !== null) 
          && ((next && (currentIdx < this.walkService.getSteps().length))
            || (!!next && (currentIdx >= 0)))){

            this.swiperContainer.nativeElement.swiper.update();

            if(next){
              this.onButtonTrigger = true;
              this.onButtonDirection = "next";
              this.swiperContainer?.nativeElement.swiper.slideNext();
            } else {
              this.onButtonTrigger = true;
              this.onButtonDirection = "prev";
              this.swiperContainer?.nativeElement.swiper.slidePrev();
            }
        }
        
      })
    )

    this.subs.add(
      this.walkService.onMoveToSlide().subscribe((idx:number)=>{
        this.swiperContainer?.nativeElement.swiper.slideTo(
          idx,
          10, 
          false
        );

        this.swiperContainer?.nativeElement.swiper.update();
        this.walkService.startTuto(this.walkService.getSteps()[0].id);
      })
    );
  }

  ngAfterViewInit(): void {

    this.subs.add(
      this.walkService.onFinishLoadWalkThru().subscribe((data: CyranoTutorialConfig)=>{
        this.tutoData = { ...this.walkService.getConfig()};    
        this.panels = Object.keys(this.tutoData);

        if(this.panels.length > 0){
          const swiperElement = this.swiperContainer?.nativeElement;

          if(swiperElement){
            Object.assign(swiperElement, SwiperConfig);
    
            swiperElement.initialize();

            let activePanel = this.panels[0];
            let activeWalkThru = this.tutoData[activePanel][0];
            let focusElementSelector = ('#' + activePanel + activeWalkThru.focusElementId.replace('#','')).toLowerCase();

            this.walkService.setActiveId(activeWalkThru.id);
            this.walkthroughActiveStepsIdx = 0;
            this.setActiveBtn(focusElementSelector.replace('#',''));

          }
          
        }
      })
    );
    
    setTimeout(() => {
      const swiperEl = this.swiperContainer?.nativeElement;

      if (swiperEl?.swiper) {
        swiperEl.swiper.update(); // 🔧 Recalculate layout  
        this.cd.markForCheck()
        this.cd.detectChanges();
        this.walkService.startTuto(this.walkService.getActiveId());

        swiperEl.swiper.on('transitionEnd', ()=>{
          this.zone.run(() => {
            this.onSwiping = false;
            this.walkService.setSwiping(false);
            this.onButtonTrigger = false;

            if(this.walkService.isActive()){
              let step =this.walkService.getCurrentStep();
              if(step){
                this.walkService.notifyTutoNavigation(step);
              }
            }

          });
        })
      }
    }, 300);
 
  }

  public onSwiperMove(event:any){
    if(this.walkService.isActive() && !SwiperConfig.centeredSlides){
      if(window.innerWidth > 641){
        let direction = this.swiperContainer?.nativeElement.swiper.swipeDirection;
        let isEnd = this.swiperContainer?.nativeElement.swiper.isEnd;
        let isBeginning = this.swiperContainer?.nativeElement.swiper.isBeginning;
        // let activeIndex = event["detail"][0].activeIndex;
        let currentStepIdx = this.walkService.getStepIdxFromId(this.walkService.getActiveId());
        let totalSteps = this.walkService.getSteps().length;

        if((
          (isEnd && (currentStepIdx < totalSteps && direction === 'next')) || 
          (isBeginning && currentStepIdx > 0))){

          if(direction === 'prev') {
            
            if(!this.onSwiping){
              this.onSwiping = true;
              this.walkService.setSwiping(this.onSwiping);
              
              this.swiperContainer?.nativeElement.swiper.slideTo(
                event["detail"][0].activeIndex-1, 
                10, 
                false
              );
      
              this.swiperContainer?.nativeElement.swiper.update();
              let step = this.walkService.getPrevStep();

              if(step){
                this.walkService.setActiveId(step.id);
                this.setActiveBtn(step.focusElementSelector.replace('#', ''));
                // this.walkService.scrollIntoView(this.walkService.getScreenById(step.id));
              }
            }
            
          } else if(direction === 'next') {
          
            if(!this.onSwiping){

              this.onSwiping = true;
              this.walkService.setSwiping(this.onSwiping);
              
              this.swiperContainer?.nativeElement.swiper.slideTo(
                event["detail"][0].activeIndex+1, 
                10, 
                false
              );
      
              this.swiperContainer?.nativeElement.swiper.update();      
              let step = this.walkService.getNextStep();

              if(step){
                this.walkService.setActiveId(step.id);
                this.setActiveBtn(step.focusElementSelector.replace(' ','').replace('#', ''));
                // this.walkService.scrollIntoView(this.walkService.getScreenById(step.id));
              }
      
            }
            
          }
        } 
      }
    }
  }

  public onSlideChange(event:any){
    let activeSwiperIdx = this.swiperContainer?.nativeElement.swiper.activeIndex;
    // let direction = this.swiperContainer?.nativeElement.swiper.swipeDirection;
    let direction = event.detail[0].swipeDirection;
    let currentActiveIdx = this.walkService.getStepIdxFromId(this.walkService.getActiveId());

    let stepIdx = (((this.onButtonTrigger && this.onButtonDirection === 'next')
                  ||(!this.onButtonTrigger && direction === 'next')) && 
                  (activeSwiperIdx !== currentActiveIdx + 1)) ? 
                    currentActiveIdx + 1 : 
                  (((!this.onButtonTrigger && direction === 'prev') 
                  ||(this.onButtonTrigger && this.onButtonDirection === 'prev')) && (activeSwiperIdx !== currentActiveIdx - 1)) ?
                    currentActiveIdx - 1 : activeSwiperIdx;

    // sort navigation on custom walkthrough component
    let step = this.walkService.getSteps()[stepIdx];

    if(step && this.walkService.isActive()){
      this.walkService.setActiveId(step.id);
      this.setActiveBtn(step.focusElementSelector.replace('#',''));
      // this.walkService.scrollIntoView(this.walkService.getScreenById(step.id));
    }
  }

  onBeforeSlideChange(event:any){
    this.onSwiping = true;
    this.walkService.setSwiping(true);
    
    // set slide to last slide once reached  
    if(event["detail"][0].activeIndex >= this.walkService.getSteps().length-1) {
      this.swiperContainer?.nativeElement.swiper.slideTo(
        this.walkService.getSteps().length-1, 
        10, 
        false
      );
              
      this.swiperContainer?.nativeElement.swiper.update();

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
    this.swiperContainer?.nativeElement.swiper.update();
  }

  public setActiveBtn(id: string): void{
    if(id !== ''){
      this.walkthroughActive = id;
      this.btnGroupService.notifyButtonGrpReady(id);
    } else {
      this.walkthroughActive = '';
    }
    
  }

  public setCurrentActiveScreen(screenId:string):void {
    this.activeScreen = screenId;
  }

  isActiveScreen(panelId:string):boolean{
    
    if(this.walkthroughActive !== '' && this.walkService.isActive()){
      let screenId = this.walkService.getScreenById(this.walkService.getActiveId());
      return panelId === screenId
    }
    
    return false;
  }


  public highlightAll(screenIsActive:boolean): boolean{
    let step = this.walkService.getCurrentStep();

    if(step){
      return  screenIsActive && !step.focusBackdrop;
    }

    return false
  }

  /**
   * Close walkthrough
   */
  public closeWalkthrough(): void {
    this.activeScreen = '';
    this.walkthroughActive = '';

    this.setActiveBtn('');

    this.walkService.setActiveId('');
    this.walkService.closeTuto();
    this.walkService.setWalkStatus(false);
  }

  ngOnDestroy(): void {
    this.closeWalkthrough()
    this.walkService.setWalkStatus(true);
    this.swiperContainer?.nativeElement.swiper.destroy();
    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }


  
}
