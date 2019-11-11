import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-before-render-example',
  templateUrl: './before-render.component.html',
  styleUrls: ['./before-render.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-before-render-example', { title: 'Before Render', additionalFiles: [ './model.ts' ] })
export class BeforeRenderExample {
  model = new Hero();
}
