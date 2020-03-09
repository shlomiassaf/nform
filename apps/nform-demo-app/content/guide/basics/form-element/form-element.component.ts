import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-form-element-example',
  templateUrl: './form-element.component.html',
  styleUrls: ['./form-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-form-element-example', { title: 'Managed Form Element' })
export class FormElementExample {
  model = new Hero();
}
