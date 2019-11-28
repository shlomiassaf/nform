import { ChangeDetectionStrategy, Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { NFormComponent, BeforeRenderEventHandler } from '@pebula/nform';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

export function getSuperPowersAsync(): Promise<Array<{ labe?: string; value: string; }>> {
  return new Promise( r => setTimeout(r, 1000 ))
    .then( () => {
      return [
        { value: 'atomicVision', label: 'Atomic Vision' },
        { value: 'teleportation', label: 'Teleportation' },
        { value: 'physicalRestoration', label: 'Physical Restoration' },
        { value: 'timeTravel', label: 'Time Travel' },
        { value: 'mindReading', label: 'Mind Reading' }
      ];
    });
}

@Component({
  selector: 'pbl-field-sync-redraw-example',
  templateUrl: './field-sync-redraw.component.html',
  styleUrls: ['./field-sync-redraw.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-field-sync-redraw-example', { title: 'Field Sync Redraw', additionalFiles: [ './model.ts' ] })
export class FieldSyncRedrawExample {
  model = new Hero();
  stateFieldType: 'select' | 'radio' = 'select';

  @ViewChild(NFormComponent, { static: true }) dynForm: NFormComponent;

  beforeRender($event: BeforeRenderEventHandler): void {
    const superPower = $event.records['superPower'];
    if (superPower) {
      // ASYNC CALLS THAT BLOCK THE WHOLE FORM FROM RENDERING, GOOD FOR GETTING DATA FROM REMOTE SERVER.
      // E.G.: GETTING GROUPS LISTED UNDER A USER, ETC...
      const existingPowers = superPower.getData('options') || [];
      const p = getSuperPowersAsync().then(newPowers => {
        if (existingPowers.length !== 10) {
          existingPowers.push(...newPowers);
        }
        superPower.mergeData({ options: existingPowers });
      });
      // mark this field as async, no render until promise completes.
      $event.async(p);

      this.fieldSync();
    }
  }

  fieldSync(): void {
    const superPower = this.dynForm.records['superPower'];
    if (superPower && this.stateFieldType !== superPower.vType) {
      superPower.vType = this.stateFieldType;
      if (this.stateFieldType === 'radio') {
        superPower.mergeData({ vertical: true });
      }
    }
  }
}
