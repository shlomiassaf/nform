import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-hide-and-disable-example',
  templateUrl: './hide-and-disable.component.html',
  styleUrls: ['./hide-and-disable.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-hide-and-disable-example', { title: 'Hide And Disable', additionalFiles: [ './model.ts' ] })
export class HideAndDisableExample {
  model = new Hero();
}
