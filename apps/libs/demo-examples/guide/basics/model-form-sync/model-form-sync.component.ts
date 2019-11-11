import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-model-form-sync-example',
  templateUrl: './model-form-sync.component.html',
  styleUrls: ['./model-form-sync.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-model-form-sync-example', { title: 'Model Form Sync', additionalFiles: [ './model.ts' ] })
export class ModelFormSyncExample {
  model = new Hero();
}
