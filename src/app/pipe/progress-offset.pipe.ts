import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressOffset',
  standalone: true,
  pure: true,
})
export class ProgressOffsetPipe implements PipeTransform {
  transform(progress: number, totalLength: number = 100): number {
    return totalLength - progress;
  }
}
