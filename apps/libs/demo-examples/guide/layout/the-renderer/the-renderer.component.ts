import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-the-renderer-example',
  templateUrl: './the-renderer.component.html',
  styleUrls: ['./the-renderer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-the-renderer-example', { title: 'The Renderer', additionalFiles: [ './model.ts' ] })
export class TheRendererExample {
  model = new Hero();
}
