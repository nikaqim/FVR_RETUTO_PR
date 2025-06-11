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

import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { TutoService } from '../../services/tuto.service';

import { transition } from '@angular/animations';
import { Button } from '../shared/button/button.model';
import { CyranoTutorial } from '../../model/cyrano-walkthrough.model';
import { Swiper } from 'swiper/types';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonsModule,
    BtnGroupComponent,
    LanguageSelectorComponent,
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

  public buttonGroup :ButtonGroup[] = [];
  public tutoData:CyranoTutorialConfig = {};

  private onSwiping: boolean = false;

  public panels:string[] = [];
  public activeScreen:string = "";

  public walkthroughActive:string = '';

  private onButtonTrigger:boolean = false
  
  public activeScreenMap: Record<string,boolean> = {};
  public highlightMap: Record<string, boolean | null > = {};
  public panelsSanitized: { original: string; id: string }[] = [];

  constructor(
    private zone: NgZone,
    private btnGroupService: BtnGroupService,
    private walkService: TutoService,
    private cd: ChangeDetectorRef
  ){

    this.btnGroupService.getButtonConfig().subscribe((data:IBtnGroupConfig) => {
      
      data['btngroup'].forEach(group => {
        group.buttons = this.filterInactiveBtn(group.buttons);
        this.buttonGroup.push(group);
      });


    });
  }

  ngOnInit(): void {
    this.initSubs();
  }

  public filterInactiveBtn(buttons:Button[]): Button[] {
    return buttons.filter((btn)=>{ 
      return btn.visible === undefined || btn.visible
    })
    
  }

  private initSubs(): void{

    // for navigation trigger swiper
    this.subs.add(
      this.walkService.isOnTriggerSwiper()
      .pipe(debounceTime(100)).subscribe((panelIdx:number) => {

        let swiperEl: Swiper = this.swiperContainer?.nativeElement.swiper;
        let snapLen: number = swiperEl.snapGrid.length;
        let step: CyranoTutorial | null = this.walkService.getCurrentStep();
        let currentIdx: number | null = step ? this.walkService.getStepIdxFromId(step.id) : null;
        let toStep: CyranoTutorial = this.walkService.getSteps()[panelIdx];
        let toStepIdx: number | null = toStep ? this.walkService.getStepIdxFromId(toStep.id) : null;

        if(currentIdx !== null && (currentIdx !== panelIdx)){
          
          this.onButtonTrigger = true;

          let indexWOffset: number | null = ((toStepIdx !== null) 
            && toStepIdx < snapLen) ? panelIdx : null;

          if(toStep){
            this.walkService.setActiveId(toStep.id);
            this.setActiveBtn(toStep.focusElementSelector.replace('#', ''));
          }

          if(indexWOffset !== null){
            swiperEl.slideTo(indexWOffset, 10, false);
            swiperEl.update();
          } else {
            this.walkService.notifyTutoNavigation(toStep);
            this.onButtonTrigger = false;
          }
        }
      })
    )

    this.subs.add(
      this.walkService.onMoveToSlide().subscribe((idx:number)=>{
        if(this.swiperContainer?.nativeElement.swiper.activeIndex === idx){

          this.walkService.triggerSwiper(0);
          let step = this.walkService.getSteps()[0];
          this.walkService.setActiveId(step.id);
          this.setActiveBtn(step.focusElementSelector.replace('#',''));
          this.walkService.notifyTutoNavigation(this.walkService.getSteps()[0]);

        } else {

          this.swiperContainer?.nativeElement.swiper.slideTo(
            idx,
            10, 
            false
          );

          this.swiperContainer?.nativeElement.swiper.update();
        }
        
        this.walkService.startTuto(this.walkService.getSteps()[0].id);
      })
    );
  }

  ngAfterViewInit(): void {

    this.subs.add(
      this.walkService.onFinishLoadWalkThru().subscribe((data: CyranoTutorialConfig)=>{
        this.tutoData = { ...this.walkService.getConfig()};    
        this.panels = Object.keys(this.tutoData);

        this.panelsSanitized = this.panels.map(panel => ({
          original: panel,
          id: panel.replace(' ', '')
        }));

        if(this.panels.length > 0){
          const swiperElement = this.swiperContainer?.nativeElement;

          if(swiperElement){
            Object.assign(swiperElement, SwiperConfig);
    
            swiperElement.initialize();

            let activePanel = this.panels[0];
            let activeWalkThru = this.tutoData[activePanel][0];
            let focusElementSelector = ('#' + activePanel + activeWalkThru.focusElementId.replace('#','')).toLowerCase();

            this.walkService.setActiveId(activeWalkThru.id);
            this.setActiveBtn(focusElementSelector.replace('#',''));

          }

          // for (const panel of this.panelsSanitized) {
          //   for (const btngrp of this.buttonGroup) {

          //     const filteredBtns = btngrp.buttons.filter(
          //       btn => btn.visible === undefined || btn.visible
          //     );

          //     this.filteredButtonGroups.push({
          //       panelId: panel.id,
          //       btnGroupId: panel.original + btngrp.id, // same as `[id]` binding
          //       layout: btngrp.layout,
          //       buttons: filteredBtns
          //     });
          //   }
          // }
          
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

        let direction: string = this.swiperContainer?.nativeElement.swiper.swipeDirection;
        let isEnd: boolean = this.swiperContainer?.nativeElement.swiper.isEnd;
        let isBeginning: boolean = this.swiperContainer?.nativeElement.swiper.isBeginning;
        let currentStepIdx: number = this.walkService.getStepIdxFromId(this.walkService.getActiveId());
        let totalSteps: number = this.walkService.getSteps().length;

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
              }
      
            }
            
          }
        } 
      }
    }
  }

  public onSlideChange(event:any){
    let swiperEl: Swiper = this.swiperContainer?.nativeElement.swiper;
    let activeSwiperIdx: number = swiperEl.activeIndex;
    let snapLen: number = swiperEl.snapGrid.length;
    let touchDif: number = Math.abs(swiperEl.touches.diff);
    let direction: string = event.detail[0].swipeDirection;
    let currentActiveIdx: number = this.walkService.getStepIdxFromId(this.walkService.getActiveId());

    let stepIdx: number = ((!this.onButtonTrigger && direction === 'next') && (activeSwiperIdx !== currentActiveIdx + 1)) ? 
                    currentActiveIdx + 1 : 
                  ((!this.onButtonTrigger && direction === 'prev') && (activeSwiperIdx !== currentActiveIdx - 1)) ?
                    currentActiveIdx - 1 : activeSwiperIdx;

    let useStepIdx: boolean = (snapLen+1 !== this.walkService.getTotalSteps()) && (touchDif < 321);

    stepIdx = useStepIdx ? stepIdx : activeSwiperIdx;
    stepIdx = this.onButtonTrigger ? currentActiveIdx : stepIdx;

    // sort navigation on custom walkthrough component
    let step: CyranoTutorial = this.walkService.getSteps()[stepIdx];

    if(step && this.walkService.isActive()){
      this.walkService.setActiveId(step.id);
      this.setActiveBtn(step.focusElementSelector.replace('#',''));
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

    this.updateActiveScreenMap();
    this.cd.markForCheck(); 
  }

  public setCurrentActiveScreen(screenId:string):void {
    this.activeScreen = screenId;
  }

  private updateActiveScreenMap(): void {
    this.activeScreenMap = {};
    this.highlightMap = {};

    if (this.walkthroughActive !== '' && this.walkService.isActive()) {
      const currentStepId = this.walkService.getCurrentStep()?.id;
      if (currentStepId) {
        const screenId = this.walkService.getScreenById(currentStepId);

        this.panelsSanitized.forEach(panel => {
          const isActive = panel.id === screenId;
          this.activeScreenMap[panel.original] = isActive;

          const step = this.walkService.getCurrentStep();
          const shouldHighlight = isActive && step && !step.focusBackdrop;

          this.highlightMap[panel.original] = shouldHighlight;
        });
      }
    }
  }

  public isActiveScreen(panelId:string): boolean{
    if(this.walkthroughActive !== '' && this.walkService.isActive()){
      let currentStepIdx: string | undefined = this.walkService.getCurrentStep()?.id

      if(currentStepIdx){
        let screenId: string = this.walkService.getScreenById(currentStepIdx);
        return panelId === screenId
      }
    }
    
    return false;
  }


  public highlightAll(screenIsActive:boolean): boolean{
    let step:CyranoTutorial | null = this.walkService.getCurrentStep();

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
