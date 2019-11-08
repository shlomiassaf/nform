import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { isJsObject } from '@pebula/utils';
import { MetaClass, PropMetadata, BaseMetadata, DecoratorInfo, ModelMetadataArgs, targetStore, ModelMetadata } from '@pebula/utils/meta/internal';
import { Model } from '@pebula/utils/meta';

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
  props = new Map<string, FormPropMetadata>();

  constructor(metaArgs: FormModelMetadataArgs | undefined, info: DecoratorInfo) {
    super(info);

    if (isJsObject(metaArgs)) {
      this.validator = metaArgs.validator || null;
      this.asyncValidator = metaArgs.asyncValidator || null;
    }
  }

  addProp(prop: PropMetadata, metaArgs: FormPropMetadata) {
    this.props.set(prop.name as any, metaArgs);
  }

  getProp(propertyKey: string): FormPropMetadata | undefined {
    return this.props.get(propertyKey);
  }
}

/* For the proxy */

// declare module '@pebula/utils/meta/internal/lib/metadata/model-metadata' {
//   interface ModelMetadataArgs {
//     form?: FormModelMetadataArgs | undefined | true;
//   }
// }
