import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Component,
  TemplateRef,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Optional
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import {
  NFormRecordRef,
  NForm,
  NFormControlTemplateContext,
  NFormComponent,
  createChildFormEvent,
  FormElementType
} from '@pebula/nform';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { MaterialStoreTemplateContext, MaterialStoreInstance, TemplateStore } from './material-store-template-context';

declare module '@pebula/nform/lib/types/render-def' {
  interface RenderDef<T extends keyof FormElementType = keyof FormElementType> {
    identity?: string;
  }
}

export const storeContainer: { store: TemplateStore } = { store: undefined };

@Component({
  selector: 'material-form-control-renderer',
  templateUrl: './material-form-control-renderer.component.html',
  styleUrls: ['./material-form-control-renderer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialFormControlRenderer implements MaterialStoreInstance, NFormControlTemplateContext, OnChanges {
  /**
   * Optional, set if the provider tree where you render this template is not an ancestor of [[NFormComponent]].
   * This is usually the case when using an override template with a template defined out of scope.
   */
  @Input() get nFormCmp(): NFormComponent {
    return this._nFormCmp;
  }

  set nFormCmp(value: NFormComponent) {
    if (value) {
      this._nFormCmp = value;
    }
  }

  @Input() showLabels: boolean = true;
  @Input() item: NFormRecordRef;
  @Input() nForm: NForm<any>;

  @Input() fArray: FormArray | undefined;
  @Input() fControl: FormControl | undefined;
  @Input() fGroup: FormGroup | undefined;

  template: TemplateRef<MaterialStoreTemplateContext>;

  selectedItem: number;
  self = this;
  externalNForm: NForm<any>;

  private _nFormCmp: NFormComponent;

  constructor(@Optional() nFormCmp: NFormComponent, private cdr: ChangeDetectorRef) {
    if (nFormCmp) {
      this.nFormCmp = nFormCmp;
    }
  }

  nFormOnControlContextInit(): void {
    if (!this.template) {
      this.template = storeContainer.store.getTemplate(this.item);
      this.cdr.detectChanges();
    }
  }

  ngOnChanges(change: SimpleChanges): void {
    if ('showLabels' in change) {
      this.showLabels = coerceBooleanProperty(this.showLabels);
    }
    if ('item' in change) {
      this.template = storeContainer.store.getTemplate(this.item);
      if (this.item.isChildForm && this.fControl instanceof FormGroup) {
        const model = this.nForm.getValueModel(this.item, this.fControl);
        this.externalNForm = this.nForm.createChildForm(
          this.item.fullName,
          model,
          this.fControl
        );
      }
      switch (this.item.vType) {
        case 'chips':
          if (!this.fControl.value) {
            this.fControl.setValue([], { onlySelf: true });
          }
          const data: NFormRecordRef<'chips'>['data'] = (this.item.data || {}) as any;
          if (!data.separatorKeysCodes) {
            data.separatorKeysCodes = [ENTER, COMMA];
          }
          this.item.data = data;
         break;
      }
    }
  }

  editSingleChildForm(context: NFormControlTemplateContext): void {
    const event = createChildFormEvent(context);
    if (event.isNew) {
      event.context.fControl = context.nForm.createControl(
        context.item.fullName,
        null,
        true
      ) as any;
      event.context.fGroup.setControl(
        context.item.name,
        event.context.fControl
      );
      event.context.item.markAsChanged();
    }
    this.nFormCmp.emitRendererEvent(event);
  }

  addToList(): void {
    if (this.item.isPrimitive || this.item.isChildForm) {
      // we create a new control, `appendControl` will push the right one, either primitive or child form.
      const newControl = this.nForm.appendControl(
        this.item.fullName,
        null,
        this.item.isChildForm
      );
      this.fArray.markAsDirty();

      // fire child form edit event.
      if (this.item.isChildForm) {
        const event = createChildFormEvent(this, { fControl: <any>newControl });
        event.isNew = true;
        this.nFormCmp.emitRendererEvent(event);
      }
    }
  }

  editFromList(): void {
    const event = createChildFormEvent(this, {
      fControl: <any>this.fArray.controls[this.selectedItem]
    });
    this.nFormCmp.emitRendererEvent(event);
  }

  removeFromList(): void {
    if (this.selectedItem >= 0) {
      if (this.item.isPrimitive || this.item.isChildForm) {
        this.nForm.removeControl(this.item.fullName, this.selectedItem);
        this.fArray.markAsDirty();
      }

      this.selectedItem = undefined;
    }
  }

  hasError(errorName: string, ctx: NFormControlTemplateContext): boolean {
    if (ctx.fControl) {
      return ctx.fControl.hasError(errorName);
    } else if (ctx.fArray) {
      return ctx.fArray.hasError(errorName);
    } else if (ctx.fGroup) {
      return ctx.fGroup.hasError(errorName);
    }
    return false;
  }

  matChipAdd(event: MatChipInputEvent, arr: any[]): void {
    const input = event.input;
    const value = (event.value || '').trim();

    if (value) {
      arr.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  matChipRemove(item: any, arr: any[]): void {
    const index = arr.indexOf(item);
    if (index >= 0) {
      arr.splice(index, 1);
    }
  }
}
