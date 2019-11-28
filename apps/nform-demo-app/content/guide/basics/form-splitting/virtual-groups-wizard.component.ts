import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-virtual-groups-wizard-example',
  templateUrl: './virtual-groups-wizard.component.html',
  styleUrls: ['./virtual-groups-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-virtual-groups-wizard-example', { title: 'Virtual Groups Wizard', additionalFiles: [ './model.ts' ] })
export class VirtualGroupsWizardExample {
  model = new Hero();
}
