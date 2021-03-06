import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { isJsObject } from '@pebula/utils';
import { MetaClass, PropMetadata, BaseMetadata, DecoratorInfo, ModelMetadataArgs, targetStore, ModelMetadata } from '@pebula/metap/internal';
import { Model } from '@pebula/metap';

import { FormPropMetadata } from './form-prop';

export interface FormModelMetadataArgs {
  /**
   * Optional definition for the @Model decorator.
   * By default, @Model is called with the value provided on this property or no value if not set.
   *
   * If you wish to prevent running @Model, set this value to false but make sure you run it manually.
   */
  model?: ModelMetadataArgs | false;
  validator?: ValidatorFn;
  asyncValidator?: AsyncValidatorFn;
}

// @dynamic
@MetaClass<FormModelMetadataArgs, FormModelMetadata>({
  single: true,
  allowOn: ['class'],
  // proxy: { host: ModelMetadata, containerKey: 'form' },
  decorateBefore: defs => {
    return [
      target => {
        if (defs && defs.model === false) {
          return;
        }
        const modelMetaArgs: ModelMetadataArgs = (defs && defs.model) || undefined;
        const modelMetadata = targetStore.getMetaFor(target, ModelMetadata, true);
        if (!modelMetadata || !modelMetadata.built) {
          return Model(modelMetaArgs)(target) || target;
        }
      }
    ];
  },
})
export class FormModelMetadata extends BaseMetadata
  implements FormModelMetadataArgs {
  validator: ValidatorFn | null;
  asyncValidator: AsyncValidatorFn | null;
  props = new Map<string, [PropMetadata, FormPropMetadata]>();

  constructor(metaArgs: FormModelMetadataArgs | undefined, info: DecoratorInfo) {
    super(info);

    if (isJsObject(metaArgs)) {
      this.validator = metaArgs.validator || null;
      this.asyncValidator = metaArgs.asyncValidator || null;
    }
  }

  addProp(prop: PropMetadata, formProp: FormPropMetadata) {
    this.props.set(prop.name as any, [prop, formProp]);
  }

  getProp(propertyKey: string): FormPropMetadata | undefined {
    const meta = this.props.get(propertyKey);
    return meta ? meta[1] : undefined;
  }

  getProps(): Array<[PropMetadata, FormPropMetadata]> {
    return Array.from(this.props.values());
  }
}

/* For the proxy */

// declare module '@pebula/metap/internal/lib/metadata/model-metadata' {
//   interface ModelMetadataArgs {
//     form?: FormModelMetadataArgs | undefined | true;
//   }
// }
