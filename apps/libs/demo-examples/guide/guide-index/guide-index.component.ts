import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { UIDeveloper } from './model';

@Component({
  selector: 'pbl-guide-index-example',
  templateUrl: './guide-index.component.html',
  styleUrls: ['./guide-index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-guide-index-example', { title: 'Guide Index' })
export class GuideIndexExample {
  model = new UIDeveloper();
}
