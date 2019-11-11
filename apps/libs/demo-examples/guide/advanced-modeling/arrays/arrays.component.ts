import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-arrays-example',
  templateUrl: './arrays.component.html',
  styleUrls: ['./arrays.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-arrays-example', { title: 'Arrays', additionalFiles: [ './model.ts' ] })
export class ArraysExample {
  model = new Hero();
}
