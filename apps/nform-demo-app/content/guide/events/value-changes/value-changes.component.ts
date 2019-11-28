import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NFormComponent, NFormValueChange } from '@pebula/nform';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-value-changes-example',
  templateUrl: './value-changes.component.html',
  styleUrls: ['./value-changes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-value-changes-example', { title: 'Value Changes', additionalFiles: [ './model.ts' ] })
export class ValueChangesExample {
  model = new Hero();

  disabledControls: string[] = ['id'];

  valueChanges($event: NFormValueChange[], nFormCmp: NFormComponent): void {
    for (let c of $event) {
      switch (c.key) {
        case 'name':
          const len = c.currentValue && c.currentValue.length;
          nFormCmp.nForm.setValue('id', len);
          break;
        case 'doubleAgent':
          if (c.currentValue) {
            this.disabledControls.push('hasTracking');
            nFormCmp.nForm.setValue('hasTracking', false);
          } else {
            const idx = this.disabledControls.indexOf('hasTracking');
            if (idx > -1) {
              this.disabledControls.splice(idx, 1);
            }
          }
          break;
        default:
          break;
      }
    }
  }
}
