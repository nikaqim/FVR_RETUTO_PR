import { 
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalkthroughConfigService } from '../../services/tuto.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnChanges{
  @Input() panels:string[] = [];
  @Input() activeScreenId:string = ""; 

  @ViewChildren('navigations') navElements!: QueryList<ElementRef>;

  constructor(
    private tutoService: WalkthroughConfigService,
  ){}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['activeScreenId']){
      this.scrollToPanel(this.activeScreenId);
    }
  }

  triggerSlideFunction(): void {
    this.tutoService.triggerSwiper(true);
  }

  private scrollToPanel(panelId:string): void {
    if(this.navElements){
      const targetEl = this.navElements.find(el => el.nativeElement.id === panelId);
      if (targetEl) {
        targetEl.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
        
      }
    }
  }
}
