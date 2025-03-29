import { 
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';

import { WalkthroughConfigService } from '../../services/tuto.service';
import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { WalkDescrMap } from '../../model/cyrano-walkthrough-screenmap.model';
@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  steps:WalkDescrMap = {};
  @ViewChildren('inputDescr') inputElements!: QueryList<ElementRef>;

  constructor(
    private walkService:WalkthroughConfigService
  ){}

  ngOnInit(): void {

      const tmp = this.walkService.getAllDescr();
          
      for(let step of Object.keys(tmp)){
        if(!Array.isArray(tmp[step])){
          tmp[step] = this.reverseMarkup(tmp[step]);
        }
      }

      this.steps = JSON.parse(JSON.stringify(tmp));
  }

  ngAfterViewInit(): void {
      // console.log('Afterview init');
  }

  onInputChange(key:string, event:Event){
    // console.log("this.onInputChange",event);
    const inputElement = event.target as HTMLInputElement;
 
    const cursorPosition = inputElement.selectionStart; // ✅ Get cursor position
    const text = inputElement.value;

    this.walkService.updateText(key, text);

    // console.log("onInputChnge:this.steps",this.steps)
  }

  reverseMarkup(descr:string){
    return this.walkService.reverseMarkUp(descr);
  }

  ngOnDestroy(): void {
      // console.log('Component destroyed');
      
  }

}
