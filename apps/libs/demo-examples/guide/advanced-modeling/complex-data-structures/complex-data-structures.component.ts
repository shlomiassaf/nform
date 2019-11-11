import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-complex-data-structures-example',
  templateUrl: './complex-data-structures.component.html',
  styleUrls: ['./complex-data-structures.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-complex-data-structures-example', { title: 'Complex Data Structures', additionalFiles: [ './model.ts' ] })
export class ComplexDataStructuresExample {
  model = new Hero();
}
