import { registerTargetMetadataExtensions } from './target-metadata';
import { registerTargetStoreExtensions } from './target-store';
import { ModelMetadata } from '../model-metadata';

export { MODEL_PH } from './target-metadata';

export function registerModelExtensions(modelMetaClass: typeof ModelMetadata) {
  registerTargetMetadataExtensions(modelMetaClass);
  registerTargetStoreExtensions(modelMetaClass);
}
