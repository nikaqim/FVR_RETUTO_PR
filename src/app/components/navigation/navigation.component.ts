import {
  Component,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  QueryList,
  ElementRef,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutorialService } from '../../services/tuto.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnChanges, AfterViewInit {
  @Input() panels: string[] = [];
  @Input() activeScreenId: string = '';

  @ViewChildren('navigations') navElements!: QueryList<ElementRef>;

  public panelIds: string[] = [];
  public activeScreenIdCleaned = '';

  private tutoService = inject(TutorialService);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.panelIds = this.panels.map(panel => this.cleanId(panel));
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.activeScreenIdCleaned = this.cleanId(this.activeScreenId);

    if (changes['activeScreenId']) {
      this.scrollToPanel(this.activeScreenId);
    }
  }

  public cleanId(value: string): string {
    return value.replace(/\s+/g, '');
  }

  public triggerSlideFunction(panelClick: string): void {
    const panelIdx = this.panels.indexOf(panelClick);
    this.tutoService.triggerSwiper(panelIdx);
  }

  private scrollToPanel(panelId: string): void {
    if (this.navElements) {
      const targetEl = this.navElements.find(
        el => el.nativeElement.id === panelId
      );
      if (targetEl) {
        targetEl.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }
}
