import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { TutorialService } from '../../services/tuto.service';

import { WalkthroughDescriptionMap } from '../../interfaces/walkthrough-description-map.interface';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent implements OnInit, OnDestroy {
  private subs = new Subscription();

  public steps: WalkthroughDescriptionMap = {};
  @ViewChildren('inputDescr') inputElements!: QueryList<ElementRef>;

  private walkService = inject(TutorialService);

  ngOnInit(): void {
    this.subs.add(
      this.walkService.onFinishLoadWalkThru().subscribe(() => {
        const tmp = this.walkService.getAllDescr();

        for (const step of Object.keys(tmp)) {
          if (!Array.isArray(tmp[step])) {
            tmp[step] = this.reverseMarkup(tmp[step]);
          }
        }

        this.steps = JSON.parse(JSON.stringify(tmp));
      })
    );
  }

  public onInputChange(key: string, value: string): void {
    this.walkService.updateText(key, value);
  }

  private reverseMarkup(descr: string): string {
    return this.walkService.reverseMarkUp(descr);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }
}
