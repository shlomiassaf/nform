import { TransformDir } from '../../fw/interfaces';
import { TargetMetadata } from '../target-metadata';
import { targetStore } from '../target-store';
import { ModelMetadata } from '../model-metadata';

export const MODEL_PH = Symbol('ModelMetadata placeholder');

declare module '../target-metadata' {
  interface TargetMetadata<T, Z> {
    /**
     * Indicates if the model returned from model() is a placeholder or a {@link ModelMetadata} instance.
     */
    hasModel: boolean;

    /**
     * Returns a placeholder or the {@link ModelMetadata} instance (or a derived class instance) for the target.
     *
     * If a {@link ModelMetadata} instance is not yet created, a plain object is returned.
     * The plain object is used a a placeholder for storing model metadata before the instance get's created.
     *
     * Use the `hasModel` property to check if it is a plain object or a {@link ModelMetadata} instance
     */
    model<T extends ModelMetadata>(): T | undefined;

    /**
     * Returns the target's identity key without initiating a target build.
     * @param target
     * @param direction
     * @returns
     */
    getIdentityKey(direction?: TransformDir): string | undefined;
  }
}

export function registerTargetMetadataExtensions(modelMetaClass: typeof ModelMetadata) {
  Object.defineProperty(TargetMetadata.prototype, 'model', {
    // this[MODEL_PH] is set from ModelMetadata constructor
    // if not set, create one to act as temporary placeholder until set.
    // ModelMetadata will grab the data on the placeholder and take it into account
    value: function(this: TargetMetadata) { return this[MODEL_PH] || (this[MODEL_PH] = {}); }
  });
  Object.defineProperty(TargetMetadata.prototype, 'hasModel', {
    get: function(this: TargetMetadata) { return this[MODEL_PH] instanceof modelMetaClass; }
  });

  TargetMetadata.prototype.getIdentityKey = function getIdentityKey(this: TargetMetadata, direction?: TransformDir): string | undefined {
    return targetStore.getIdentityKey(this.target, direction);
  };

}
