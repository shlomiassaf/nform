import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-virtual-groups-example',
  templateUrl: './virtual-groups.component.html',
  styleUrls: ['./virtual-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-virtual-groups-example', { title: 'Virtual Groups', additionalFiles: [ './model.ts' ] })
export class VirtualGroupsExample {
  model = new Hero();
}
