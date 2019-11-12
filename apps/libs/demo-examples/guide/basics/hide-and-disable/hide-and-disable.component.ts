import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-hide-and-disable-example',
  templateUrl: './hide-and-disable.component.html',
  styleUrls: ['./hide-and-disable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-hide-and-disable-example', { title: 'Hide And Disable', additionalFiles: [ './model.ts' ] })
export class HideAndDisableExample {

  model = new Hero();

  controlState = {
    exclude: [],
    disabled: [],
    hidden: []
  };

  handleControlState(state: string[], name: string): void {
    setTimeout(() => {
      const idx = state.indexOf(name);
      if (idx === -1) {
        state.push(name);
      } else {
        state.splice(idx, 1);
      }
    });
  }

}
