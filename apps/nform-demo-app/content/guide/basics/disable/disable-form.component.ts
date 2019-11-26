import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-disable-form-example',
  templateUrl: './disable-form.component.html',
  styleUrls: ['./disable-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-disable-form-example', { title: 'Disable Form', additionalFiles: [ './model.ts' ] })
export class DisableFormExample {
  disabled: boolean = true;
  model = new Hero();
}
