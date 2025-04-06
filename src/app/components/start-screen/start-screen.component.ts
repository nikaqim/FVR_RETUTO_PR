import { 
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';

import { WalkthroughConfigService } from '../../services/tuto.service';
import { WalkDescrMap } from '../../model/cyrano-walkthrough-screenmap.model';
@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit {
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

  public onInputChange(key:string, event:Event): void{
    const inputElement = event.target as HTMLInputElement;
 
    const cursorPosition = inputElement.selectionStart; // ✅ Get cursor position
    const text = inputElement.value;

    this.walkService.updateText(key, text);
  }

  private reverseMarkup(descr:string): string {
    return this.walkService.reverseMarkUp(descr);
  }


}
