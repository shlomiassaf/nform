import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-controlling-nform-example',
  templateUrl: './controlling-nform.component.html',
  styleUrls: ['./controlling-nform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-controlling-nform-example', { title: 'Controlling Nform' })
export class ControllingNFormExample {
  model = new Hero();
}
