import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-advanced-controls-example',
  templateUrl: './advanced-controls.component.html',
  styleUrls: ['./advanced-controls.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-advanced-controls-example', { title: 'Advanced Controls', additionalFiles: [ './model.ts' ] })
export class AdvancedControlsExample {
  model = new Hero();
}
