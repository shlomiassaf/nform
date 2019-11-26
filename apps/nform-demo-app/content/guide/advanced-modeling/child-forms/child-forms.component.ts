import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-child-forms-example',
  templateUrl: './child-forms.component.html',
  styleUrls: ['./child-forms.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-child-forms-example', { title: 'Child Forms', additionalFiles: [ './model.ts' ] })
export class ChildFormsExample {
  model = new Hero();
}
