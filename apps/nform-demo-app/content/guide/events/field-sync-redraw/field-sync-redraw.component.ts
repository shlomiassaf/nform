import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

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
}
