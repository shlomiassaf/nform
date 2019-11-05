import {
  ComponentFactoryResolver,
  Directive,
  Input,
  ViewContainerRef,
  Optional,
  TemplateRef,
  SimpleChanges,
  IterableDiffers,
  IterableDiffer,
  TrackByFunction,
  SimpleChange,
  OnChanges,
  IterableChanges,
  IterableChangeRecord,
  DoCheck
} from '@angular/core';
import { NgForOf, NgForOfContext } from '@angular/common';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { NForm, NFormRecordRef, NFormControlTemplateContext } from '../../nform/index';
import { NFormComponent } from '../nform/nform.component';
import { NFormArray } from './nform-array';

const forFormArrayContextKeys: Array<keyof ForFormArrayDirective> = [
  'item',
  'nForm',
  'fGroup',
  'dynForm'
];

@Directive({
  selector: '[nFormArray]'
})
export class NFormArrayDirective extends NFormArray {
  // tslint:disable
  @Input('nFormArrayDynForm') dynForm: NFormComponent;
  @Input('nFormArrayFArray') fArray: FormArray;
  @Input('nFormArrayFGroup') fGroup: FormGroup;
  @Input('nFormArrayItem') item: NFormRecordRef;
  @Input('nFormArrayNForm') nForm: NForm<any>;
  // tslint:enable

  vcRef: ViewContainerRef;

  constructor(vcRef: ViewContainerRef, cfr: ComponentFactoryResolver, dynForm: NFormComponent<any>) {
    super(cfr, dynForm);
    this.vcRef = vcRef;
  }
}

@Directive({
  selector: '[forFormArray]'
})
export class ForFormArrayDirective extends NgForOf<NFormControlTemplateContext>
  implements OnChanges, DoCheck {
  // tslint:disable
  @Input('forFormArrayOf') fArray: FormArray;
  @Input('forFormArrayTrackBy')
  ngForTrackBy: TrackByFunction<NFormControlTemplateContext>;

  @Input('forFormArrayDynForm') dynForm: NFormComponent;
  @Input('forFormArrayFGroup') fGroup: FormGroup;
  @Input('forFormArrayItem') item: NFormRecordRef;
  @Input('forFormArrayNForm') nForm: NForm<any>;

  // TODO: warn or throw when setting context after one of the values in the context was set manually
  @Input('forFormArrayContext')
  set context(value: NFormControlTemplateContext) {
    if (value) {
      for (let k of forFormArrayContextKeys) {
        this[k] = value[k];
      }
    }
  }
  // tslint:enable

  private ready: boolean = false;
  private formArrayDiffer: IterableDiffer<AbstractControl> | null = null;
  private grouped: NFormControlTemplateContext[][] = [];
  private ngForOfRef: NFormControlTemplateContext[];

  constructor(tRef: TemplateRef<NgForOfContext<NFormControlTemplateContext>>,
              private differs: IterableDiffers,
              vcRef: ViewContainerRef,
              @Optional() dynForm: NFormComponent<any>) {
    super(vcRef, tRef, differs);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.ready !==
      !!(
        this.nForm &&
        this.fArray &&
        this.fGroup &&
        this.item &&
        this.item.isArray
      )
    ) {
      this.ready = !this.ready;

      if (changes.fArray) {
        const controls = this.fArray && this.fArray.controls;
        this.trySetDiffer(controls);

        // Backward compat for angular < 6.1
        // https://github.com/angular/angular/commit/08a18b82de003c379aa76323e65e8230e5b42a56#diff-e63254bca5a65cfdc11f078011bddf98
        // TODO: remove when not supporting 6.0.0
        // @ts-ignore
        if (super.ngOnChanges) {
          changes.ngForOf = new SimpleChange(
            this.ngForOf,
            [],
            changes.fArray.isFirstChange()
          );
          this.ngForOf = this.ngForOfRef = changes.ngForOf.currentValue;
          // @ts-ignore
          super.ngOnChanges(changes);
        } else {
          this.ngForOf = this.ngForOfRef = [];
        }
      }
    }
  }

  ngDoCheck(): void {
    if (this.formArrayDiffer) {
      const changes = this.formArrayDiffer.diff(
        this.fArray && this.fArray.controls
      );
      if (changes) {
        this.applyFormArrayChanges(changes);
        super.ngDoCheck();
      }
    }
  }

  private applyFormArrayChanges(changes: IterableChanges<AbstractControl>) {
    const renderers: NFormControlTemplateContext[] = <any>this.ngForOfRef;
    changes.forEachOperation(
      (
        item: IterableChangeRecord<any>,
        adjustedPreviousIndex: number,
        currentIndex: number
      ) => {
        if (item.previousIndex == null) {
          const values = this.convert([
            this.fArray.controls[item.currentIndex]
          ]);
          const prevValues = this.grouped[currentIndex - 1];
          this.grouped[currentIndex] = values;
          if (prevValues && prevValues.length > 0) {
            currentIndex += prevValues.length;
          }
          renderers.splice(currentIndex, 0, ...values);
        } else if (currentIndex == null) {
          const values = this.grouped.splice(adjustedPreviousIndex, 1)[0];
          renderers.splice(adjustedPreviousIndex, values.length);
        } else {
          const values = this.grouped.splice(adjustedPreviousIndex, 1)[0];
          renderers.splice(adjustedPreviousIndex, values.length);

          this.grouped[currentIndex] = values;
          renderers.splice(currentIndex, 0, ...values);
        }
      }
    );
    changes.forEachIdentityChange((record: any) => {
      const values = this.grouped.splice(record.currentIndex, 1)[0];
      const newValues = this.convert([
        this.fArray.controls[record.currentIndex]
      ]);
      renderers.splice(record.currentIndex, values.length, ...newValues);
    });
  }

  private convert(controls: AbstractControl[]): NFormControlTemplateContext[] {
    const result: NFormControlTemplateContext[] = [];
    for (let childControl of controls) {
      for (let childItem of this.item.children) {
        const c = childItem.resolveFormArrayChild(childControl);
        const $implicit: NFormControlTemplateContext = <any>{
          item: childItem,
          fGroup: this.fGroup,
          nForm: this.nForm,
          [c instanceof FormArray ? 'fArray' : 'fControl']: c
        };
        result.push($implicit);
      }
    }
    return result;
  }

  private trySetDiffer(value: AbstractControl[]): void {
    if (!this.formArrayDiffer && value) {
      try {
        this.formArrayDiffer = this.differs.find(value).create();
      } catch (e) {
        throw new Error(`Cannot find a differ supporting object '${value}' of type '${getTypeNameForDebugging(
          value
        )}'.\
         NgFor only supports binding to Iterables such as Arrays.`);
      }
    }
  }
}

export function getTypeNameForDebugging(type: any): string {
  return type['name'] || typeof type;
}
