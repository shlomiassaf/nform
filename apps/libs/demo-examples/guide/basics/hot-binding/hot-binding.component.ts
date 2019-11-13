import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-hot-binding-example',
  templateUrl: './hot-binding.component.html',
  styleUrls: ['./hot-binding.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-hot-binding-example', { title: 'Hot Binding', additionalFiles: [ './model.ts' ] })
export class HotBindingExample {
  hotBind: boolean = true;
  model = new Hero();
}
