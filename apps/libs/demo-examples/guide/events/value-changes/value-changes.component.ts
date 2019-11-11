import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-value-changes-example',
  templateUrl: './value-changes.component.html',
  styleUrls: ['./value-changes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-value-changes-example', { title: 'Value Changes', additionalFiles: [ './model.ts' ] })
export class ValueChangesExample {
  model = new Hero();
}
