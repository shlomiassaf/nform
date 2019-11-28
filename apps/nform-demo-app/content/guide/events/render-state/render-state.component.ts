import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BeforeRenderEventHandler } from '@pebula/nform';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

export function getSuperPowersAsync(): Promise<Array<{ labe?: string; value: string; }>> {
  return new Promise( r => setTimeout(r, 3000 ))
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
  selector: 'pbl-render-state-example',
  templateUrl: './render-state.component.html',
  styleUrls: ['./render-state.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-render-state-example', { title: 'Render State', additionalFiles: [ './model.ts' ] })
export class RenderStateExample {
  model = new Hero();

  beforeRender($event: BeforeRenderEventHandler): void {
    const bmi = $event.records['bmi'];
    if (bmi) {
      bmi.vType = 'number';
    }

    const superPower = $event.records['superPower'];
    if (superPower) {
      // ASYNC CALLS THAT BLOCK THE WHOLE FORM FROM RENDERING, GOOD FOR GETTING DATA FROM REMOTE SERVER.
      // E.G.: GETTING GROUPS LISTED UNDER A USER, ETC...
      const p = getSuperPowersAsync().then(newPowers => {
        const existingPowers = superPower.getData('options') || [];
        existingPowers.push(...newPowers);
        superPower.mergeData({ options: existingPowers });
      });
      // mark this field as async, no render until promise completes.
      $event.async(p);
    }
  }
}
