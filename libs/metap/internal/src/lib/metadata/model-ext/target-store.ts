import { Constructor, isFunction } from '@pebula/utils';
import { TransformDir } from '../../fw/interfaces';
import { targetEvents } from '../../fw/events';
import { PropMetadata } from '../prop';
import { TargetMetadata } from '../target-metadata';
import { TargetStore, targetStore } from '../target-store';
import { ModelMetadata } from '../model-metadata';

declare module '../target-store' {
  interface TargetStore {
    /**
     * Returns the target's identity key without initiating a target build.
     * @param target
     * @param direction
     * @returns
     */
    getIdentityKey(target: Constructor<any>, direction?: TransformDir): string | undefined;

    /**
     * Returns metadata, if not built, builds it
     * @param target
     * @param register when true will also register if not exists
     * @returns
     */
    getTargetMeta<T, Z>(target: Z & Constructor<T>): TargetMetadata<T, Z> | undefined;

    /**
     * Returns the target's name key without initiating a target build.
     * @param target
     * @returns
     */
    getTargetName(target: Constructor<any>): string | undefined;
  }
}

export function registerTargetStoreExtensions(modelMetaClass: typeof ModelMetadata) {
  // set the name for name lookup
  targetStore.on.processType(target => {
    const model = targetStore.getTargetMeta(target).model();
    if (model) {
      // TODO: make this type safe
      targetStore['namedTargets'].set(model.resName, target);
    }
  });


  TargetStore.prototype.getTargetName = function getTargetName(this: TargetStore, target: Constructor<any>): string | undefined {
    return targetStore.getMetaFor(target, modelMetaClass, true, 'resName');
  };

  TargetStore.prototype.getTargetMeta = function getTargetMeta(target: Constructor<any>): TargetMetadata | undefined {
    let meta = this.builtTargets.get(target);
    if (!meta) {
      const metaArgs = this.targets.get(target);

      if (!metaArgs) {
        this.registerTarget(target);
        return this.getTargetMeta(target);
      }

      meta = new TargetMetadata(target, metaArgs);
      this.builtTargets.set(target, meta);
      targetEvents.FIRE.createMetadata(target);
    }
    return meta;
  };

  TargetStore.prototype.getIdentityKey = function getIdentityKey(this: TargetStore, target: Constructor<any>, direction?: TransformDir): string | undefined {
    const meta = this.getTargetMeta(target);
    const model = meta.model();
    const identity = model.identity as any;

    if (identity) {
      if (!direction) {
        return identity;
      }

      const propMeta = meta.getMetaFor(PropMetadata, identity);

      // apply naming strategy when DON'T HAVE ALIAS!
      if (propMeta.name === propMeta.alias[direction]) {
        const transformNameStrategy = model.transformNameStrategy;

        if (transformNameStrategy && isFunction(transformNameStrategy[direction])) {
          // in exclusive mode there is no point in have 2 transformation strategies.
          // incoming is never there since incoming keys are not calculated, only defined Props.
          if (model.transformStrategy === 'exclusive') {
            direction = 'outgoing';
          }

          return transformNameStrategy[direction](propMeta.name);
        }
      }

      return direction === 'outgoing' ? propMeta.alias.outgoing : propMeta.alias.incoming;
    }
  };
}
