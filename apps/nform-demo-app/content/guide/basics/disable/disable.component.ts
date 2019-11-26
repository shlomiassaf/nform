import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NFormRecordRef } from '@pebula/nform';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-disable-example',
  templateUrl: './disable.component.html',
  styleUrls: ['./disable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-disable-example', { title: 'Disable', additionalFiles: [ './model.ts' ] })
export class DisableExample {

  model = new Hero();

  disabledRecords: NFormRecordRef[] = [];
  disabled: string[] = [];

  toggleDisabled(record: NFormRecordRef): void {
    const idx = this.disabledRecords.indexOf(record);
    if (idx === -1) {
      this.disabledRecords.push(record);
    } else {
      this.disabledRecords.splice(idx, 1);
    }

    this.disabled = this.disabledRecords.map( r => r.name );
    /*  We replaced the "disabled" array with a new one but nForm also supports array diffing
        so you can mutate the existing array:

        this.disabled.splice(0, this.disabled.length, ...this.disabledRecords.map( r => r.name ));
    */
  }

}
