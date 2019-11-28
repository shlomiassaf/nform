import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PblNFormModule, FORM_CONTROL_COMPONENT } from '@pebula/nform';

import { BindNgModule } from '@pebula/apps/shared';
import { PblRowLayoutNformRenderer } from '@pebula/apps/shared-nform';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { FormSplittingExample } from './form-splitting.component';
import { VirtualGroupsExample } from './virtual-groups.component';
import { VirtualGroupsWizardExample } from './virtual-groups-wizard.component';

@NgModule({
  declarations: [ FormSplittingExample, VirtualGroupsExample, VirtualGroupsWizardExample ],
  imports: [
    ExampleCommonModule,
    PblNFormModule,
    MatTabsModule,
  ],
  exports: [ FormSplittingExample, VirtualGroupsExample, VirtualGroupsWizardExample ],
  entryComponents: [ FormSplittingExample, VirtualGroupsExample, VirtualGroupsWizardExample ],
  providers: [
    { provide: FORM_CONTROL_COMPONENT, useValue: PblRowLayoutNformRenderer },
  ],
})
@BindNgModule(FormSplittingExample, VirtualGroupsExample, VirtualGroupsWizardExample)
export class FormSplittingExampleModule { }
