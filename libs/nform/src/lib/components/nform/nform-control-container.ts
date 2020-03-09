import { AbstractControl, ControlContainer } from '@angular/forms';

export class NFormControlContainer extends ControlContainer {
  get control(): AbstractControl | undefined { return this.nFormCmp.form; }

  constructor(private readonly nFormCmp: import('./nform.component').NFormComponent) { super(); }
}
