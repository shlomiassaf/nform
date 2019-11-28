import { ChangeDetectionStrategy, Component, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { NFormComponent, NFormOverrideContext } from '@pebula/nform';
import { Example } from '@pebula/apps/shared';

import { Hero } from './model';

@Component({
  selector: 'pbl-imperative-example',
  templateUrl: './imperative.component.html',
  styleUrls: ['./imperative.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-imperative-example', { title: 'Imperative' })
export class ImperativeExample implements AfterViewInit {
  model = new Hero();

  @ViewChild(NFormComponent, { static: true })
  nForm: NFormComponent;

  @ViewChild('defaultFieldOverrideTpl', { static: true, read: TemplateRef })
  defaultFieldOverrideTpl: TemplateRef<NFormOverrideContext>;

  constructor() {
    this.model.name = 'Batman';
  }

  ngAfterViewInit(): void {
    this.nForm.addOverride({ controlName: '*' }, this.defaultFieldOverrideTpl, true);
  }
}
