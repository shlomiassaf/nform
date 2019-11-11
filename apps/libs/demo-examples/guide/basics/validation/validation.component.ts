import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-validation-example',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-validation-example', { title: 'Validation', additionalFiles: [ './model.ts' ] })
export class ValidationExample {
  model = new Hero();
}
