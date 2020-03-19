import { SimpleChanges, OnChanges, ViewContainerRef, TemplateRef } from '@angular/core';
import { isString } from '@pebula/utils';

import { FormElementType } from '../types/index';
import { NFormRecordRef } from '../nform/nform-record-ref';

export class ControlSelectorBase implements OnChanges {
  controlName: string | string[];
  vType: keyof FormElementType | Array<keyof FormElementType>;

  /**
   * Returns true when the control name is catch all
   */
  get isCatchAll(): boolean {
    return this.controlName === '*';
  }

  protected filter = {
    names: [] as string[],
    vTypes: [] as Array<keyof FormElementType>
  };

  isMatching(rd: NFormRecordRef): boolean {
    return (
      (!this.vType || this.filter.vTypes.indexOf(rd.vType) > -1) &&
      (this.controlName &&
        (this.controlName === '*' || this.controlName.indexOf(rd.name) > -1))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('controlName' in changes || 'vType' in changes) {
      this.syncQuery();
    }
  }

  syncQuery(): void {
    this.filter.names = Array.isArray(this.controlName)
      ? this.controlName
      : isString(this.controlName) ? [this.controlName] : [];

    this.filter.vTypes = Array.isArray(this.vType)
      ? this.vType
      : isString(this.vType) ? [this.vType] : [];
  }
}

export interface NFormControlOutlet<T = any> {
  isMatching(rd: NFormRecordRef): boolean;
  readonly vcRef: ViewContainerRef;
  readonly tRef?: TemplateRef<T>;
}
