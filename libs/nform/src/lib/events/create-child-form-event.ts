import { NFormControlTemplateContext, NForm } from '../nform';
import { ChildFormEditRendererEvent } from './renderer-event';

function cloneContext(baseCtx: NFormControlTemplateContext, mergeCtx?: Partial<NFormControlTemplateContext>): NFormControlTemplateContext {
  return Object.assign(
    {
      item: baseCtx.item,
      nForm: baseCtx.nForm,
      fArray: baseCtx.fArray,
      fControl: baseCtx.fControl,
      fGroup: baseCtx.fGroup
    },
    mergeCtx || {}
  );
}

export function createChildFormEvent(ctx: NFormControlTemplateContext, mergeCtx?: Partial<NFormControlTemplateContext>): ChildFormEditRendererEvent {
  ctx = cloneContext(ctx, mergeCtx);
  let createdNForm: NForm<any>;
  const rootNForm = ctx.nForm;

  return {
    type: 'childFormEdit',
    isNew: ctx.fControl.value === null,
    context: ctx,
    createNForm(): NForm<any> {
      if (createdNForm) {
        throw new Error('');
      }
      return (createdNForm = ctx.nForm.createChildForm(
        ctx.item.fullName,
        ctx.fControl.value,
        <any>ctx.fControl
      ));
    },
    reset(): void {
      // new that is not an array is inline, this requires reset of that specific control because it
      // needs to be set to FormControl(null), which is a null FormGroup of child form.
      if (this.isNew && !this.context.item.isArray) {
        rootNForm.resetControl(ctx.item.fullName);
      } else if (createdNForm) {
        // we don't publish up, because it will change the state (pristine, dirty, etc) of the parent which
        // on arrays is not true
        createdNForm.reset({ onlySelf: this.isNew });
      }
    }
  } as ChildFormEditRendererEvent;
}
