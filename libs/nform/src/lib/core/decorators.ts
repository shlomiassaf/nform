import { MetaClass } from '@pebula/metap/internal';

import { FormModelMetadataArgs, FormModelMetadata, FormPropMetadata } from './metadata/index';

// export const FormModel = MetaClass.decorator(FormModelMetadata, true);
// We need to do some funky stuff for angular compiler...
export const FormModel: (def?: FormModelMetadataArgs) => ClassDecorator = MetaClass['decorator'](FormModelMetadata, true);

export const FormProp = MetaClass.decorator(FormPropMetadata, true);
