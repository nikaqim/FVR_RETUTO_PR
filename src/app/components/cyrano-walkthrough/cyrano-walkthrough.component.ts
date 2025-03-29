import { 
  Component,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  OnChanges,
  SimpleChanges,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';

import { Subscription } from 'rxjs';

import { WsService } from '../../services/ws.service';

import { CyranoTutorial } from '../../model/cyrano-walkthrough.model';
import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';

import { 
  WalkthroughComponent,
  WalkthroughEvent,
  WalkthroughNavigate,
} from 'angular-walkthrough';

import { WalkthroughConfigService } from '../../services/tuto.service';
import { ArrowService } from 'src/app/services/arrow.service';

@Component({
  selector: 'app-cyrano-walkthrough',
  templateUrl: './cyrano-walkthrough.component.html',
  styleUrl: './cyrano-walkthrough.component.scss'
})
export class CyranoWalkthroughComponent implements 
  OnInit, OnChanges, AfterViewInit, OnDestroy {

    private subs = new Subscription();  

    @ViewChild('tutorWrapper') tutorWrapper!: ElementRef<HTMLDivElement>;
    @ViewChildren(WalkthroughComponent) walkthroughComponents!: QueryList<WalkthroughComponent>;
    @ViewChildren('navigations') navElements!: QueryList<ElementRef>;

    // receive walkthrough config for each steps
    @Input() data:CyranoTutorialConfig = {};
    @Input() addSwiperNav:boolean = false;
    @Output() isOpen = new EventEmitter<string>();

    steps: CyranoTutorial[] = [];
    panels:string[] = [];
    activeScreenId:string = ""; 
    activeId: string = "";
    activeArrowId: string = "";

    constructor( 
      private wsService:WsService,
      private tutoService: WalkthroughConfigService,
      private arrowService: ArrowService
    ){}

    ngOnInit(): void {

      // rxjs observable
      this.subs.add(
        this.wsService.listen('walkJsonUpdate').subscribe((msg:CyranoTutorialConfig) => {
          // console.log("walkJsonUpdate");
            this.reset(msg)

        })
      );

      this.subs.add(
        this.tutoService.onNotifyTextChange().subscribe((msg:CyranoTutorialConfig)=>{
          
        })
      )

      this.subs.add(
        this.tutoService.onTutoClose().subscribe((status:boolean)=>{
            this.close()
        })
      )

      this.subs.add(
        WalkthroughComponent.onOpen.subscribe((comp: WalkthroughComponent)=>{

          console.log(`#${comp.id} is open & point to el${comp.focusElementSelector} -> alreadyshow ${WalkthroughComponent.walkthroughHasShow()}`);
        })
      );
  
      this.subs.add(
        WalkthroughComponent.onNavigate
        .subscribe((comt: WalkthroughNavigate) => {
          const current = this.tutoService.getById(comt.next.id);
          this.activeId = comt.next.id;
          this.tutoService.setActiveId(this.activeId);
          this.isOpen.emit(current?.focusElementSelector.replace("#",''));
          
          if(current){
            this.drawArrow(current, current?.focusElementSelector);
            this.tutoService.notifyTutoNavigation(current)
          }

          console.log("WalkthroughComponent.walkthroughHasShow():",WalkthroughComponent.walkthroughHasShow());
        })
      );
  
      this.subs.add(
        this.tutoService.onSwiperChanged()
          .subscribe((screen:string) => {

          // `setting ${screen} as active..`
          this.activeScreenId = screen;
          
        })
      );
  
      this.subs.add(
        this.tutoService.onStartTuto().subscribe((id:string)=>{
          this.open(id);
        })
      );
    }

    reset(config:CyranoTutorialConfig=this.data){
      // console.log("resetting walkthrough")
      this.close(); // close walkthrough
      this.tutoService.resetTabulatedId(); // clear walkthrough data
      this.destroy(); // destroy walkthrough existing components

      this.steps = this.tutoService.tabulateStep(config); // get new steps
      this.construct_walk();
      // this.tutoService.loadWalkthrough();
    }

    ngOnChanges(changes: SimpleChanges): void {
      if(changes['data']){
        // console.log("in walk - data changes ->", this.data);
        this.steps = this.tutoService.tabulateStep(this.data);
        this.panels = this.tutoService.getScreens();
        // console.log("this.panels ->",this.panels);
      }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        // console.log("screen on resize...");
        // this.construct_walk();
        this.reset();
        this.close();
    }

    ngAfterViewInit(): void {
      this.construct_walk();
    }

    drawArrow(event:WalkthroughComponent, arrowId: string){
      console.log('drawArrow:',event);
      const comp = event

      if(comp){
        const fromEl = 'descr-' + comp.id
        const toEl = comp.focusElementSelector.replace('#','')

        if(this.activeArrowId){
          this.arrowService.removeArrow(this.activeArrowId);
        }
        
        this.activeArrowId = arrowId;

        setTimeout(()=>{

          const el = document.querySelector(".wkt-content-block") as HTMLElement;
          const screen = document.querySelector(".screen-container.onwalk");
          const backdrop = document.querySelector('.wkt-zone') as HTMLElement;

          console.log("bgdrop",backdrop);

          if(backdrop){
            
            backdrop.style.setProperty('box-shadow', 'none', 'important');
          }

          if(screen && el){
            // readjust position so don't get out of screen
            const scr = screen.getBoundingClientRect();
            const elPos = el.getBoundingClientRect();

            if(window.innerWidth < 551){
              
              el.style.top =(elPos.top + 56) + 'px';

            } else  if(elPos.top < scr.top){

              el.style.top = scr.top + 'px';

            }
            
            el.style.left = (scr.left + 8) + 'px'; 

            console.log(`ScreenTop:${scr.top} Left:${scr.left} Bottom:${scr.bottom} \n 
              Right:${scr.right} Width:${scr.width} Height:${scr.height}`);
          }

          this.arrowService.drawArrow(fromEl, toEl, this.activeArrowId);

        }, 150)
      }
      
      
    }

    /**
   * Assigning walkthrough attributes setting value
   */
  construct_walk(): void {

    setTimeout(()=> {
      // console.log("this.walkthroughComponents:",this.walkthroughComponents);

      if(this.walkthroughComponents){

        this.walkthroughComponents.forEach((walkthru, idx, arr) => {  
          const step = this.steps.find(s=>s.id === walkthru.id);
          // console.log("register walk");

          if(step?.id){
            this.tutoService.register(step.id, walkthru);
          }
        });
  
        this.steps.forEach(step => {
          const current = this.tutoService.getById(step.id);
    
          if(current){
            current.alignContent = step.contentAlign === "left" ? 'left' :
              step.contentAlign === "right" ? 'right':
              step.contentAlign === "content" ? 'content' : 'center';
            
            current.verticalAlignContent = step.contentVertAlign === "above" ? 'above' :
            step.contentVertAlign === "center" ? 'center' : step.contentVertAlign === "top" ? 'top':
            step.contentVertAlign === "bottom" ? 'bottom' : 'below';

            // current.showArrow = step.showArrow ? step.showArrow : false;
            current.showArrow = false;
            current.closeAnywhere = step.closeAnywhere ? step.closeAnywhere : false;
            current.finishButton = step.showFinishBtn ? step.showFinishBtn : false;
            current.contentSpacing = 0;
            current.focusBackdrop = step.focusBackdrop;
            current.verticalContentSpacing= 50;
            current.focusGlow = false;
            // current.rootElement = ".screen-container";
            current.rootElement = '#' + this.tutoService.getScreenById(step.id);
            current.focusElementSelector = window.innerWidth < 551 ?
              step.focusElementId :
              ('#' + this.tutoService.getScreenById(step.id) + step.focusElementId.replace('#','')).toLowerCase();
            
            // console.log(window.innerWidth, "|| current.focusElementSelector:",current.focusElementSelector);
            // current.focusHighlightAnimation = true
          }
          
          if (step.nextStepId) {
              const next = this.tutoService.getById(step.nextStepId);
              if (current && next) {
                  current.nextStep = next;
              }
          }
    
          if(step.prevStepId){
              const prev = this.tutoService.getById(step.prevStepId);
              if(current && prev){
                current.previousStep = prev;
              }
          }
        });

        console.log("this.steps:",this.steps);
        if(this.steps.length > 0){
          this.open(this.steps[0].id);
          this.activeId = this.steps[0].id;
          this.tutoService.setActiveId(this.activeId);
          this.tutoService.activateSwipeNav(this.steps[0].id);
        }
      }
    },100)    
  }

  navigateWalkThru(){    
    const current = this.tutoService.getById(this.activeId);

    // console.log("current:",current);

    if(current && current.nextStep){
      // console.log("click on container", this.tutoService.getScreenById(current.nextStep.id));
      this.tutoService.scrollIntoView(this.tutoService.getScreenById(current.nextStep.id));
      WalkthroughComponent.walkthroughNext();  
    }
  }

  /**
   * Open walkthrough by stepId
   */
  open(stepId: string): void {
    if(this.walkthroughComponents){
      const targetWalkthrough = this.walkthroughComponents.find(wt => wt.id === stepId);
      if (targetWalkthrough) {
          targetWalkthrough.open();
          this.activeId = this.steps[0].id;
          this.tutoService.setActiveId(this.activeId);
          this.tutoService.activateSwipeNav(stepId);
          
          this.isOpen.emit(this.steps[0].focusElementId.replace('#',''));

          if(WalkthroughComponent.walkthroughHasShow()){
            this.drawArrow(targetWalkthrough, this.steps[0].focusElementId);
          }


      } else {
          console.warn(`Walkthrough with id '${stepId}' not found`);
      } 
      
    }
     
  }

  /**
   * Close walkthrough
   */
  close(){
    const container = document.querySelector('.wkt-finish-link');
    if (container) {
        (container as HTMLElement).click();

        // remove active class
        this.activeScreenId = '';
        this.activeId = '';
        this.tutoService.setActiveId(this.activeId);
        this.isOpen.emit('');

        this.arrowService.removeAll();
        this.activeArrowId = '';
    }
  }

  destroy():void {
    WalkthroughComponent.walkthroughStop();  
    this.steps.forEach(step => this.tutoService.unregister(step.id));
  }

  ngOnDestroy(): void {
    this.close();
    this.destroy();

    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }

}
