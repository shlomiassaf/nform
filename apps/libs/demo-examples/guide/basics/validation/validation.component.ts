import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ValidationErrors,  AbstractControl } from '@angular/forms';
import { BeforeRenderEventHandler } from '@pebula/nform';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-validation-example',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-validation-example', { title: 'Validation', additionalFiles: [ './model.ts' ] })
export class ValidationExample {
  model = new Hero();

  beforeRender(event: BeforeRenderEventHandler): void {
    if (event.isRoot) {
      const nameRecord = event.records['name'];
      nameRecord.asyncValidators = fakeCheckName;
    }
  }
}

function fakeCheckName(c: AbstractControl): Promise<ValidationErrors | null> {
  return new Promise(resolve => {
    setTimeout(() => {
      const name = c.value || '';
      if (!name || name[0].toLowerCase() === 'a') {
        resolve({
          nameExists: `${name} already exists`
        });
      } else {
        resolve(null);
      }
    }, 1000);
  });
}


