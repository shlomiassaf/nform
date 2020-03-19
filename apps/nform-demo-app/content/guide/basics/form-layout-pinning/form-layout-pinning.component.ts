import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-form-layout-pinning-example',
  templateUrl: './form-layout-pinning.component.html',
  styleUrls: ['./form-layout-pinning.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-form-layout-pinning-example', { title: 'Form Layout Pinning', additionalFiles: [ './model.ts' ] })
export class FormLayoutPinningExample {
  model = new Hero();
}
