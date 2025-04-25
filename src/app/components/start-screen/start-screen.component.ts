import { 
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { WalkthroughConfigService } from '../../services/tuto.service';
import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { WalkDescrMap } from '../../model/cyrano-walkthrough-screenmap.model';
@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit {
  private subs = new Subscription(); 

  steps:WalkDescrMap = {};
  @ViewChildren('inputDescr') inputElements!: QueryList<ElementRef>;

  constructor(
    private walkService:WalkthroughConfigService
  ){}

  ngOnInit(): void {
    this.subs.add(
      this.walkService.onFinishLoadWalkThru().subscribe((data:CyranoTutorialConfig) => {
        const tmp = this.walkService.getAllDescr();
          
        for(let step of Object.keys(tmp)){
          if(!Array.isArray(tmp[step])){
            tmp[step] = this.reverseMarkup(tmp[step]);
          }
        }
  
        this.steps = JSON.parse(JSON.stringify(tmp));
      })
    )
    
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
