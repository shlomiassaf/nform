import { Constructor, Mixin } from '@pebula/utils';
import { TargetStore } from '../metadata/target-store';

const ModelClassCollectionMark = Symbol('ModelClassCollection instance mark');
const NON_EXTENDABLE_PROPS = ['constructor'];

const pCopyMap = new Map<any, Array<string | symbol>>();

function buildAndCacheProperties(proto: any) {
  const propertiesToCopy = Object.getOwnPropertyNames(proto)
    .concat(Object.getOwnPropertySymbols(proto) as any)
    .filter(v => NON_EXTENDABLE_PROPS.indexOf(v) === -1);

  pCopyMap.set(proto, propertiesToCopy);
}

function runtimeExtend(proto: any, thisVar: Array<any>): any {
  const propertiesToCopy = pCopyMap.get(proto) || [];

  thisVar[ModelClassCollectionMark] = true;

  for (let i = 0, len = propertiesToCopy.length; i < len; i++) {
    const name = propertiesToCopy[i];
    const propDesc = Object.getOwnPropertyDescriptor(proto, name);
    if (propDesc) {
      Object.defineProperty(thisVar, name, propDesc);
    } else {
      thisVar[name] = proto[name];
    }
  }
}

// TODO: document the class and how to use it. explain about methods that return new instance (concat, reverse, etc)
// that return Array instance and not ActiveRecordCollection instance.
// TODO: override ref changing methods? throw on them? return ActiveRecordCollection on them?
export class ModelClassCollection<T /* extends ActiveRecord<any, any> */> extends Array<T> {
  constructor() {
    super();
    runtimeExtend(ModelClassCollection.prototype, this);
  }

  static extend(type: any): void {
    Mixin(ModelClassCollection as any, type);
    buildAndCacheProperties(ModelClassCollection.prototype);
  }

  static instanceOf(instance: any): instance is ModelClassCollection<any> {
    return instance[ModelClassCollectionMark] === true;
  }

  /**
   * Creates a new instance of ModelClassCollection.
   * If a type is specified, returns the ModelClassCollection class for that type.
   * It is recommended to use this method along with a type to ensure plugins functionality.
   * @param type
   */
  static create<T>(): ModelClassCollection<T>
  static create<T>(targetStore: TargetStore, type: Constructor<T>): ModelClassCollection<T>;
  static create<T>(targetStore?: TargetStore, type?: Constructor<T>): ModelClassCollection<T> {
    if (!type) {
      return new ModelClassCollection<any>();
    } else {
      return targetStore.getTargetMeta(type).createCollection();
    }
  }

  /**
   * Creates a new ModelClassCollection class mixed in with the proto object.
   * @param proto An object literal used as a mixin to the ModelClassCollection prototype.
   * @returns
   */
  static factory<T>(proto: any): typeof ModelClassCollection & Constructor<ModelClassCollection<T>> {
    const clz = class RuntimeTDMCollection<T> extends ModelClassCollection<T> {
      constructor() {
        super();
        runtimeExtend(clz.prototype, this);
      }

      static extend(type: any): void {
        Mixin(ModelClassCollection as any, type);
        buildAndCacheProperties(clz.prototype);
      }
    };

    Object.defineProperty(clz, Symbol.hasInstance, {
      value: clz.instanceOf
    });

    Object.assign(clz.prototype, proto);
    buildAndCacheProperties(clz.prototype);

    return clz;
  }
}

Object.defineProperty(ModelClassCollection, Symbol.hasInstance, {
  value: ModelClassCollection.instanceOf
});

buildAndCacheProperties(ModelClassCollection.prototype);
