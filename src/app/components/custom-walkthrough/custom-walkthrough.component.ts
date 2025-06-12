import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';

import { Subscription, debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CyranoTutorial } from '../../model/cyrano-walkthrough.model';

import { TutorialService } from '../../services/tuto.service';
import { ArrowService } from 'src/app/services/arrow.service';

@Component({
  selector: 'app-custom-walkthrough',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-walkthrough.component.html',
  styleUrl: './custom-walkthrough.component.scss',
})
export class CustomWalkthroughComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() data: CyranoTutorial[] = [];
  @Input() panelId: string = '';
  @Input() isActive: boolean = false;
  @Input() addSwiperNav: boolean = false;
  @Output() activeScreenId = new EventEmitter<string>();

  public steps: CyranoTutorial[] = [];
  public panels: string[] = [];
  private activeArrowId: string = '';

  private subs = new Subscription();

  private tutoService = inject(TutorialService);
  private arrowService = inject(ArrowService);

  ngOnInit(): void {
    this.initSubs();
  }

  private initSubs(): void {
    this.subs.add(
      this.tutoService
        .onTutoNavigation()
        .pipe(debounceTime(500))
        .subscribe((focusElementSelector: string) => {
          if (this.isActive) {
            const step = this.tutoService.getCurrentStep();
            if (step) {
              this.activeScreenId.emit(this.tutoService.getScreenById(step.id));

              if (step.showArrow) {
                if (
                  this.activeArrowId !== '' &&
                  this.arrowService.isExist(this.activeArrowId)
                ) {
                  this.showArrow();
                } else {
                  this.drawArrow(step, focusElementSelector, this.panelId);
                }
              }
            }
          }
        })
    );

    this.subs.add(
      this.tutoService.onTutoNavigation().subscribe(() => {
        const step = this.tutoService.getCurrentStep();

        if (step && step.id !== this.data[0].id) {
          const arrowId = this.removeArrow();
          this.arrowService.removeArrow(arrowId);
        }
      })
    );

    this.subs.add(
      this.tutoService.onTutoClose().subscribe(() => {
        if (this.isActive) {
          this.hideArrow();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.subs.add(
      this.tutoService.onStartTuto().subscribe(() => {
        if (this.isActive) {
          const step = this.tutoService.getCurrentStep();

          if (step && step.showArrow) {
            this.activeScreenId.emit(this.tutoService.getScreenById(step.id));
            const focusElementSelector = (
              '#' +
              this.panelId +
              step.focusElementId.replace('#', '')
            ).toLowerCase();

            this.drawArrow(step, focusElementSelector, this.panelId);
          }
        }
      })
    );
  }

  private hideArrow(): string {
    const element = document.querySelector(
      `.linecontainer-${this.activeArrowId}`
    );

    if (element) {
      if (!element.classList.contains('hidden')) {
        element.classList.add('hidden');
      }
    }

    return this.activeArrowId;
  }

  private showArrow(): string {
    const element = document.querySelector(
      `.linecontainer-${this.activeArrowId}`
    );

    if (element) {
      if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
      }
    }

    return this.activeArrowId;
  }

  private removeArrow(): string {
    const elementSelector = (
      '#' +
      this.panelId +
      this.data[0].focusElementId.replace('#', '')
    ).toLowerCase();
    const arrowId = elementSelector.replace(' ', '').replace('#', '');
    const element = document.querySelector(`.linecontainer-${arrowId}`);

    if (element) {
      element.remove();
    }

    return arrowId;
  }

  private drawArrow(
    event: CyranoTutorial,
    arrowId: string,
    containerId: string
  ) {
    const comp = event;

    if (comp) {
      const fromEl = 'descr-' + comp.id;
      const toEl = arrowId.replace(' ', '').replace('#', '');

      this.activeArrowId = arrowId.replace(' ', '').replace('#', '');

      const backdrop = document.querySelector('.wkt-zone') as HTMLElement;

      if (backdrop) {
        backdrop.style.setProperty('box-shadow', 'none', 'important');
      }

      this.arrowService.drawArrow(
        fromEl,
        toEl,
        containerId,
        this.activeArrowId
      );
    }
  }

  ngOnDestroy(): void {
    this.arrowService.removeAll();
    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }
}
