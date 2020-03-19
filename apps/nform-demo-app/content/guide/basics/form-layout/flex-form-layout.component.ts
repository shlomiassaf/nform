import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-flex-form-layout-example',
  templateUrl: './flex-form-layout.component.html',
  styleUrls: ['./flex-form-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-flex-form-layout-example', { title: 'Flex Form Layout' })
export class FlexFormLayoutExample {
  model = new Hero();
}
