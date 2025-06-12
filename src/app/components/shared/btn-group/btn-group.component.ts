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
  OnDestroy,
  inject,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ButtonComponent } from '../button/button.component';
import { TranslateModule } from '@ngx-translate/core';

import { BtnGroupService } from '../../../services/btn.service';
import { Button } from '../button/button.model';
import { TutorialService } from '../../../services/tuto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn-group',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslateModule],
  templateUrl: './btn-group.component.html',
  styleUrl: './btn-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnGroupComponent
  implements OnChanges, AfterViewInit, OnInit, OnDestroy
{
  @Input() id: string = '';
  @Input() type: string = 'vert';
  @Input() buttons: Button[] = [];
  @Input() screenId: string = '';
  @Input() activeId: string = '';

  public arcButtons: Button[] = [];
  public baseButtons: Button[] = [];

  public buttonStyles: { [id: string]: Partial<CSSStyleDeclaration> } = {};
  public buttonClasses: { [id: string]: string } = {};
  public baseButtonClasses: { [id: string]: string } = {};

  public screenIdNormalized: string = '';

  private buttonIds: string[] = [];
  private subs = new Subscription();
  private mainAssigned: string = '';

  @Output() ButtonGroupReady = new EventEmitter<string>();

  public isTypeVertical = false;

  private btnService = inject(BtnGroupService);
  private walkService = inject(TutorialService);

  ngOnInit(): void {
    this.initSubs();

    // to seperate button in arc or main
    if (this.type === 'arc') {
      this.arcButtons = this.buttons.filter(btn => {
        return !btn.main;
      });

      this.baseButtons = this.buttons.filter(btn => {
        return btn.main;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.isTypeVertical = this.type === 'vert';

      this.buttons.forEach(btn => {
        this.buttonIds.push(btn.id);
      });
    }

    if (changes['buttons'] || changes['type']) {
      if (this.type === 'arc') {
        this.arcButtons = this.buttons.filter(btn => !btn.main);
        this.baseButtons = this.buttons.filter(btn => btn.main);

        // Precompute styles
        this.buttonStyles = {};
        const total = this.arcButtons.length;
        const radius = 50 + total * 3;
        const startAngle = Math.PI / 2;
        const endAngle = (3 * Math.PI) / 2;

        for (let i = 0; i < total; i++) {
          const reversedIndex = total - 1 - i;
          const angle =
            startAngle +
            ((endAngle - startAngle) / (total - 1)) * reversedIndex;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          this.buttonStyles[this.arcButtons[i].id] = {
            transform: `translate(${x}px, ${y}px)`,
          };
        }
      }
    }

    if (
      changes['id'] ||
      changes['screenId'] ||
      changes['activeId'] ||
      changes['buttons']
    ) {
      this.screenIdNormalized = this.screenId.toLowerCase().replace(' ', '');
      this.isTypeVertical = this.type === 'vert';
      this.computeButtonClasses();
    }
  }

  ngAfterViewInit() {
    this.ButtonGroupReady.emit(this.buttonIds.join());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }

  public assignMain(btn: Button): string {
    if (btn.main && this.mainAssigned === '') {
      this.mainAssigned = btn.id;
    }

    return this.mainAssigned;
  }

  private initSubs(): void {
    // on walkthru navigate next focus nextElement/btn
    this.walkService.onTutoNavigation().subscribe((btnId: string) => {
      if (btnId) {
        const parentId = this.btnService.getScreenContainerId(
          btnId.replace(' ', '')
        );
        this.walkService.scrollIntoView(parentId);
      }
    });
  }

  private computeButtonClasses(): void {
    this.buttonClasses = {};
    this.baseButtonClasses = {};
    const normalizedActiveId = this.activeId.replace(
      this.screenIdNormalized,
      ''
    );

    const resolveClass = (btn: Button): string => {
      if (btn.main) return 'app-btn hide';
      return btn.id === normalizedActiveId
        ? 'app-btn active'
        : `app-btn ${this.activeId}`;
    };

    // Combine all for arc + vertical
    [...this.buttons, ...this.arcButtons].forEach(btn => {
      this.buttonClasses[btn.id] = resolveClass(btn);
    });

    // Separate class map for baseButtons
    this.baseButtons.forEach(btn => {
      const isActive =
        btn.id === this.activeId.replace(this.screenIdNormalized, '');
      this.baseButtonClasses[btn.id] = isActive
        ? 'app-btn active'
        : `app-btn ${this.activeId}`;
    });
  }

}
