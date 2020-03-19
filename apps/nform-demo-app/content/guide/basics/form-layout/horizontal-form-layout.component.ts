import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-horizontal-form-layout-example',
  templateUrl: './horizontal-form-layout.component.html',
  styleUrls: ['./horizontal-form-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Example('pbl-horizontal-form-layout-example', { title: 'Horizontal Form Layout' })
export class HorizontalFormLayoutExample {
  model = new Hero();
}
