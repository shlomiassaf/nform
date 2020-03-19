import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-vertical-form-layout-example',
  templateUrl: './vertical-form-layout.component.html',
  styleUrls: ['./vertical-form-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-vertical-form-layout-example', { title: 'Vertical Form Layout' })
export class VerticalFormLayoutExample {
  model = new Hero();
}
