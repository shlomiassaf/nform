import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';
import { UIDeveloper } from './model';
import { FORM_CONTROL_COMPONENT } from '@pebula/nform';
import { PblRowLayoutNformRenderer } from '@pebula/apps/shared-nform';

@Component({
  selector: 'pbl-guide-intro-example',
  templateUrl: './guide-intro.component.html',
  styleUrls: ['./guide-intro.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer }
  ]
})
@Example('pbl-guide-intro-example', { title: 'Guide Intro', additionalFiles: ['./model.ts'] })
export class GuideIntroExample {
  model = new UIDeveloper();
}
