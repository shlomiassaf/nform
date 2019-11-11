import { getProtoChain, stringify, Constructor } from '@pebula/utils';
import {
  targetEvents,
  TransformStrategy,
  NamingStrategyConfig,
  MetaClass,
  BaseMetadata,
  DecoratorInfo,
} from '../fw';

import { SerializationFactory } from '../serialization/factory';
import { targetStore } from './target-store';
import { TargetMetadata } from './target-metadata';
import { registerModelExtensions, MODEL_PH } from './model-ext';

export interface ModelMetadataArgs {
  /**
   * A name for the resource.
   * Depending on your setup, this property might be used to identify resource from deserialized data. (e.g. JSONAPI)
   * If not set, the default name is the class name (which does not guarantee uniqueness)
   * @optional
   */
  resName?: string;

  /**
   * A Factory for creating new instances of the target and or collection.
   * If not set, collection is [], target is a new instance of the type.
   */
  factory?: (isColl: boolean) => any;

  /**
   * How to treat an object when transforming it.
   *
   * inclusive - include all except explicitly excluded properties.
   * exclusive - exclude all except explicitly included properties.
   *
   * Note that every member decorated with @Prop is included by default, so `exclusive` requires
   * every member that you want to include to be decorated with @Prop
   *
   * ## exclusive vs inclusive:
   * An exclusive strategy is strict hence predictable, this means:
   *   - Reduce the change for error
   *   - Better performance
   *
   * The cost is boilerplate, writing additional code.
   *
   *
   * @optional
   * @default 'inclusive'
   */
  transformStrategy?: TransformStrategy | undefined;

  /**
   * A Default strategy for name conversion.
   * Applied on all properties except those with explicit alias defined.
   *
   *
   * ###EXAMPLE
   * ```ts
   * {
   *  transformNameStrategy: {
   *    incoming: (propertyName: string) => camelCase(propertyName),
   *    outgoing: (propertyName: string) => snakeCase(propertyName)
   *  }
   * }
   * ```ts
   *
   * The example above converts incoming server object properties to camel case (myProperty)
   * and all outgoing client object properties to snake case (my_property)
   *
   * > In exclusive mode (transformStrategy = 'exclusive` or decorating a class with @Exclude) there
   * is no meaning to the `incoming` strategy since incoming keys are not part of the process, only
   * properties defined with @Prop. This means that the outgoing strategy is a mapper for both incoming and outgoing.
   *
   * @example src/demo/modules/@netflix/models/title.ts
   * @optional
   * @default undefined
   */
  transformNameStrategy?: NamingStrategyConfig | undefined;

  mapper?: SerializationFactory;

  /**
   * If true will not build (process) the decorated class into a resource.
   * This is useful for deferring the build step.
   *
   * > Extensions of a model might change the behaviour, setting a default value when skip is not explicitly set.
   *
   * For example, if you are registering the mixin outside of the class declaration.
   *
   * ### Example
   * **Registering the mixin INSIDE the class declaration (skip: false, or don't declare it):**
   * ```ts
   * @HttpResource({ endpoint: '/api/users/:id?' })
   * export class UserBaseClass extends ActiveRecord(User_) { }
   *
   * **Registering the mixin OUTSIDE the class declaration (skip: true):**
   * ```ts
   * @HttpResource({ endpoint: '/api/users/:id?' })
   * export class UserConst_) { }
   *
   * export const UserConst = ActiveRecord(UserConst_);
   * export type UserConst = ActiveRecord<UserConst_>;
   * ```
   *
   * Manually processing is required to finish the model build.
   * @optional
   * @default false
   */
  skip?: true;
}

// exporting to satisfy angular AOT
/** @internal */
export function extendSingle(from: ModelMetadata,
                             to: ModelMetadata | undefined,
                             meta: { from: Constructor<any>; to: Constructor<any> }): ModelMetadata | undefined {
  if (!to) {
    const tMeta = targetStore.getTargetMeta(meta.to);
    return (tMeta[MODEL_PH] = from.clone(meta.to));
  } else {
    Object.keys(from).forEach(k => {
      if (!(k in to)) {
        to[k] = from[k];
      }
    });
  }
}

// @dynamic
@MetaClass<ModelMetadataArgs, ModelMetadata>({
  allowOn: ['class'],
  single: true,
  extendSingle,
  onCreated: () => registerModelExtensions(ModelMetadata),
})
export class ModelMetadata extends BaseMetadata implements ModelMetadataArgs {
  identity: TdmPropertyKey;
  resName: string;
  transformStrategy: TransformStrategy | undefined;
  transformNameStrategy: NamingStrategyConfig | undefined;
  mapper: SerializationFactory;

  tMeta: TargetMetadata;
  target: Constructor<any>;
  skip?: true;

  get built(): boolean {
    return this._built;
  }

  private _built: boolean;

  constructor(metaArgs: ModelMetadataArgs, info: DecoratorInfo, target: Constructor<any>) {
    super(info);

    const tMeta = targetStore.getTargetMeta(target);

    /*
    Checking up the proto-tree if there are temp model metadata values set.
    This allows inheritance of model classes where the base class has no class decorator but do have
    member decorators.

    ```ts
        class UserBase {
          @Identity()
          @UrlParam() id: number;
        }

        @HttpResource({
          endpoint: '/api/users/:id/:param',
          urlParams: { param: '99' }
        })
        class User extends ActiveRecord(UserBase) { }
    ```

    In the example, UserBase does not have a class decorator but the derived class User does.

    > Note: Stopping on the first prototype that has an instantiated ModelMetadata, we can stop there
    because implementation will invoke `extend` for prototypes and since it's now an instance it will auto-extend.
     */
    const protoChain = getProtoChain(target);
    for (let i = protoChain.length - 1; i > 0; i--) {
      // we skip idx 0, its the target itself.
      const meta =
        targetStore.hasTarget(protoChain[i]) &&
        targetStore.getTargetMeta(protoChain[i]);
      if (meta) {
        if (meta[MODEL_PH] && !meta.hasModel) {
          Object.assign(this, meta[MODEL_PH]);
        } else if (meta.hasModel) {
          break;
        }
      }
    }

    const classMetadata = tMeta.hasOwnProperty(MODEL_PH) ? tMeta[MODEL_PH] : {};
    Object.assign(
      this,
      classMetadata,
      metaArgs || {},
      { target, tMeta } // last obj is for clone, so we won't take previous values
    );

    if (!this.resName) {
      this.resName = stringify(target);
    }

    tMeta[MODEL_PH] = this;
  }

  clone(target: Constructor<any>): ModelMetadata {
    const ctor: typeof ModelMetadata = <any>this.constructor;
    return new ctor(this, this.decoratorInfo, target);
  }

  factory(isColl: boolean): any {
    return isColl ? this.tMeta.createCollection() : new this.target();
  }

  /**
   * Build the model.
   * @param safe If set to true will not throw if the model is already built.
   * @returns true if the model was built by this call
   */
  build(safe?: true): boolean {
    if (this.built) {
      if (safe === true) {
        return false;
      } else {
        throw new Error(`"${stringify(this.target)}" already built.`);
      }
    }
    this._built = true;
    targetEvents.FIRE.beforeProcessType(this.target);
    targetEvents.FIRE.processType(this.target);
    return true;
  }
}

declare module '../fw/metadata-framework/meta-class' {
  namespace MetaClass {
    function get(target: typeof ModelMetadata): MetaClassMetadata<ModelMetadataArgs, ModelMetadata>;
  }
}
