import { Component, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { NForm, NFormRecordRef } from '../../nform/index';
import { NFormComponent } from '../nform/nform.component';
import { NFormArray } from './nform-array';

// tslint:disable-next-line
@Component({
  selector: 'nform-array',
  templateUrl: './nform-array.component.html'
})
export class NFormArrayComponent extends NFormArray {
  @Input() nFormCmp: NFormComponent;
  @Input() fArray: FormArray;
  @Input() fGroup: FormGroup;
  @Input() item: NFormRecordRef;
  @Input() nForm: NForm<any>;

  @ViewChild('viewRef', { read: ViewContainerRef, static: true }) vcRef: ViewContainerRef;

  constructor(nFormCmp: NFormComponent<any>) {
    super(nFormCmp);
  }
}
