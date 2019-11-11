import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-nform-basics-example',
  templateUrl: './nform-basics.component.html',
  styleUrls: ['./nform-basics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-nform-basics-example', { title: 'Nform Basics', additionalFiles: [ './model.ts' ] })
export class NformBasicsExample {
  model: Hero;

  constructor() {
    this.model = new Hero();
    this.model.name = 'Iron Man';
  }
}
