import { 
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';

import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CyranoTutorial } from '../../model/cyrano-walkthrough.model';
import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';

// import { ShepherdService } from 'angular-shepherd';
import { WalkthroughConfigService } from '../../services/tuto.service';
import { ArrowService } from 'src/app/services/arrow.service';
import { BtnGroupService } from '../../services/btn.service';

@Component({
  selector: 'app-custom-walkthrough',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './custom-walkthrough.component.html',
  styleUrl: './custom-walkthrough.component.scss'
})
export class CustomWalkthroughComponent implements 
  OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() data:any = [];
  @Input() panelId:any = [];
  @Input() isActive:any = [];
  @Input() addSwiperNav:boolean = false;
  @Output() activeScreenId = new EventEmitter<string>();

  public steps: CyranoTutorial[] = [];
  public panels:string[] = [];
  private activeArrowId: string = "";

  private subs = new Subscription(); 
  
  styleOptions: Object = {
    // "display": "none"
  }

  constructor( 
    private btnService:BtnGroupService,
    private tutoService: WalkthroughConfigService,
    private arrowService: ArrowService,
    private cd: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.initSubs();
  }

  private initSubs(): void {

    this.subs.add(
      this.tutoService.onTutoNavigation()
        .pipe(debounceTime(500))
        .subscribe((focusElementSelector:string)=>{
            
            if(this.isActive){
              console.log(
                `onTutoNavigation: focusElementSelector= ${focusElementSelector}`,
                `id: data= ${this.data[0].id}`,
              )

              let step = this.tutoService.getCurrentStep();
              if(step){
                this.activeScreenId.emit(this.tutoService.getScreenById(step.id));
                this.drawArrow(step, focusElementSelector, this.panelId);
              }
            } 
    }))

    this.subs.add(
      this.tutoService.onTutoNavigation()
        .subscribe((focusElementSelector:string)=>{
            
          let step = this.tutoService.getCurrentStep();
          if(step && (step.id !== this.data[0].id)){
            console.log(
              `current active step ${step.id}`,
              `removing arrow in screen ${this.tutoService.getScreenById(this.data[0].id)}`
            );

            let arrowId = this.removeArrow()
            this.arrowService.removeArrow(arrowId);
          }
              
    }));

    this.subs.add(
      this.tutoService.onTutoClose()
      .subscribe((status:boolean)=>{
        
        if(this.isActive){
          this.removeArrow();
          this.arrowService.removeAll();
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit():void {
    this.subs.add(
      this.tutoService.onStartTuto()
        .subscribe((stepId:string)=>{
          
            if(this.isActive){
              let step = this.tutoService.getCurrentStep();
              
              if(step){
                this.activeScreenId.emit(this.tutoService.getScreenById(step.id));
                let focusElementSelector = ('#' + this.panelId + step.focusElementId.replace('#','')).toLowerCase();

                this.drawArrow(step, focusElementSelector, this.panelId);
              }

              
            }
    }))
  }

  private removeArrow(): string {
    let elementSelector =  ('#' + this.panelId + this.data[0].focusElementId.replace('#','')).toLowerCase();
    let arrowId = elementSelector.replace(' ', '').replace('#','');
    let element = document.querySelector(`.linecontainer-${arrowId}`);

    if(element){
      console.log(`removing arrow ${arrowId}`);
      element.remove();
    }

    return arrowId;
  }

  private drawArrow(event:CyranoTutorial, arrowId: string, containerId: string){
    const comp = event

    if(comp){
      const fromEl = 'descr-' + comp.id
      const toEl = arrowId.replace(' ','').replace('#','')
      
      this.activeArrowId = arrowId.replace(' ', '').replace('#','');

      const backdrop = document.querySelector('.wkt-zone') as HTMLElement;

      if(backdrop){
        
        backdrop.style.setProperty('box-shadow', 'none', 'important');
      }

      this.arrowService.drawArrow(fromEl, toEl, containerId, this.activeArrowId);
    }
    
    
  }

  ngOnDestroy(): void {
    this.arrowService.removeAll();
    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }
}


