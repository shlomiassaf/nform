import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-form-splitting-example',
  templateUrl: './form-splitting.component.html',
  styleUrls: ['./form-splitting.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-form-splitting-example', { title: 'Control Outlet', additionalFiles: [ './model.ts' ] })
export class FormSplittingExample {
  model = new Hero();
}
