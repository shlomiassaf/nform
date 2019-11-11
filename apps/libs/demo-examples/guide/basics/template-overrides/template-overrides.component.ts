import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-template-overrides-example',
  templateUrl: './template-overrides.component.html',
  styleUrls: ['./template-overrides.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-template-overrides-example', { title: 'Template Overrides', additionalFiles: [ './model.ts' ] })
export class TemplateOverridesExample {
  model = new Hero();
}
