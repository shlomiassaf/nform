import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { forceNextUpdateValueAndValidityWith } from '../utils';
import { NFormControlTemplateContext } from '../nform/nform';

/**
 * A pipe that accepts a `NFormControlTemplateContext` of a child form and transform it to
 * and array of `NFormControlTemplateContext` with each representing a property of the child form.
 */
@Pipe({ name: 'explodeChildForm' })
export class PblExplodeChildFormPipe implements PipeTransform {
  transform(ctx: NFormControlTemplateContext, silent = false): NFormControlTemplateContext[] {
    if (!ctx.item.isChildForm) {
      if (silent) {
        return [];
      }
      throw new Error('PblExplodeChildFormPipe accepts a parent context that represents a child form.');
    }

    const formGroup: FormGroup = ctx.fControl instanceof FormGroup
      ? ctx.fControl as any
      : undefined
    ;

    const model = ctx.nForm.getValueModel(ctx.item, ctx.fControl);
    const nForm = ctx.nForm.createChildForm(
      ctx.item.fullName,
      model,
      formGroup
    );

    /*
      The child form might not be a FormGroup instance, this happens when it's null or undefined which causes the library to set it as FormControl
      we need to set the new FormGroup instance in the parent form.
      This is done through `FormGroup.setControl` which triggers an update because it internally calls `FormGroup.updateValueAndValidity`.
      We need to avoid this because it causes an unwanted behavior, a new form will show invalid error message because of the event being fired.
      `FormGroup.setControl` does not allow us to control this so we need to workaround it.
    */
    if (!formGroup) {
      const { form } = ctx.nForm;
      forceNextUpdateValueAndValidityWith(form, { emitEvent: false });
      form.setControl(ctx.item.fullName, nForm.form);
    }

    return nForm.renderData.map( item => {
      const newCtx: NFormControlTemplateContext = {} as any;
      nForm.bindRenderingData(newCtx, item);
      return newCtx;
    });
  }
}
