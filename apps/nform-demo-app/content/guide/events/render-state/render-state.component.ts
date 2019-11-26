import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-render-state-example',
  templateUrl: './render-state.component.html',
  styleUrls: ['./render-state.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-render-state-example', { title: 'Render State', additionalFiles: [ './model.ts' ] })
export class RenderStateExample {
  model = new Hero();
}
