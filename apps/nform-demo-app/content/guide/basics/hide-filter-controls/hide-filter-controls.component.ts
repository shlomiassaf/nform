import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NFormRecordRef } from '@pebula/nform';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-hide-filter-controls-example',
  templateUrl: './hide-filter-controls.component.html',
  styleUrls: ['./hide-filter-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-hide-filter-controls-example', { title: 'Hide Filter Controls', additionalFiles: [ './model.ts' ] })
export class HideFilterControlsExample {

  model = new Hero();

  hiddenRecords: NFormRecordRef[] = [];
  hidden: string[] = [];

  excludedRecords: NFormRecordRef[] = [];
  excluded: string[] = [];

  toggle(record: NFormRecordRef, which: 'hidden' | 'excluded'): void {
    const records = which === 'hidden' ? this.hiddenRecords : this.excludedRecords;
    const idx = records.indexOf(record);
    if (idx === -1) {
      records.push(record);
    } else {
      records.splice(idx, 1);
    }

    const state = which === 'hidden' ? this.hidden : this.excluded;
    state.splice(0, state.length, ...records.map( r => r.name ));
  }
}
