import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-flattening-example',
  templateUrl: './flattening.component.html',
  styleUrls: ['./flattening.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-flattening-example', { title: 'Flattening', additionalFiles: [ './model.ts' ] })
export class FlatteningExample {
  model = new Hero();
}
