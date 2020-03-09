import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-custom-form-element-example',
  templateUrl: './custom-form-element.component.html',
  styleUrls: ['./custom-form-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-custom-form-element-example', { title: 'Custom Form Element' })
export class CustomFormElementExample {
  model = new Hero();
}
