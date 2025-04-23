import { 
  ChangeDetectionStrategy,
  Component, 
  EventEmitter, 
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ButtonComponent } from '../button/button.component';
import { TranslateModule } from '@ngx-translate/core';

import { BtnGroupService } from '../../../services/btn.service';
import { Button } from '../button/button.model';
import { WalkthroughConfigService } from '../../../services/tuto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn-group',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    TranslateModule
  ],
  templateUrl: './btn-group.component.html',
  styleUrl: './btn-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BtnGroupComponent implements OnChanges, AfterViewInit, OnInit, OnDestroy {

  @Input() id:string = '';
  @Input() type:string = 'vert';
  @Input() buttons:Button[] = [];
  @Input() screenId:string = '';
  @Input() activeId:string = '';

  private subs = new Subscription();  

  private mainAssigned:string = '';
  public arcButtons: Button[] = [];
  public baseButtons: Button[] = [];

  private buttonIds:string[] = [];

  @Output() ButtonGroupReady = new EventEmitter<string>();

  public isTypeVertical = false;

 constructor(
    private btnService: BtnGroupService,
    private walkService: WalkthroughConfigService
  ){
    this.initSubs();
 }

 private initSubs(): void {
  // on walkthru navigate next focus nextElement/btn 
  this.walkService.onTutoNavigation().subscribe((btnId:string)=>{
    if(btnId){
      const parentId = this.btnService.getScreenContainerId(btnId)
      this.walkService.scrollIntoView(parentId)
      
    }
  });
 }

 ngOnInit():void {
  // to seperate button in arc or main
  if(this.type === 'arc'){
    this.arcButtons = this.buttons.filter((btn) => {
      return !btn.main
    });

    this.baseButtons = this.buttons.filter((btn) => {
      return  btn.main
    });
  }

 }

 ngOnChanges(changes: SimpleChanges): void {
     if(changes['id']){
      this.isTypeVertical = this.type === 'vert';
      
      this.buttons.forEach(btn => {
        this.buttonIds.push(btn.id);
      });
     }
 }

 ngAfterViewInit(){
  this.ButtonGroupReady.emit(this.buttonIds.join())
  console.log(this.activeId, this.screenId, this.buttons);
}

  public getButtonPosition(index: number, total: number): Object {

    const radius = 50 + (total * 5); // Dynamically increase arc size
    const startAngle = Math.PI / 2; // Start at 180 degrees (semi-circle)
    const endAngle = (3 * Math.PI)/2; // End at 360 degrees

    // 🔄 Reverse the order by inverting the index
    const reversedIndex = total - 1 - index;

    const angle = startAngle + ((endAngle - startAngle) / (total - 1)) * reversedIndex; // Distribute buttons evenly

    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return {
      transform: `translate(${x}px, ${y}px)`
    };
  }

  public assignMain(btn:Button): string{
    if(btn.main && this.mainAssigned === ''){
      this.mainAssigned = btn.id;
    } 
    
    return this.mainAssigned;

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }

  
}
