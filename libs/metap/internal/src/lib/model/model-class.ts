import { MixinFree, Constructor } from '@pebula/utils';

const ModelClassMark = Symbol('ModelClass instance mark');

export interface ModelClass<T> {}

export class ModelClassBase<T> implements ModelClass<T> {
  toString(): string {
    return this.constructor.name;
  }

  static instanceOf(instance: any): instance is ModelClassBase<any> {
    return instance[ModelClassMark] === true;
  }

  static factory<T, Z>(model: Z & Constructor<T>): Z & Constructor<ModelClassBase<T>> {
    class ModelClass extends (model as Constructor<{}>) {}

    Object.defineProperty(ModelClass, 'name', {
      configurable: true,
      value: model.name
    });
    Object.defineProperty(ModelClass, Symbol.hasInstance, {
      value: ModelClassBase.instanceOf
    });

    MixinFree(ModelClass, ModelClassBase, 'proto');

    // TODO: copy other TS reflection info
    const paramTypes = (Reflect as any).getOwnMetadata('design:paramtypes', model);
    (Reflect as any).defineMetadata('design:paramtypes', paramTypes, ModelClass);

    return ModelClass as any;
  }
}

Object.defineProperty(ModelClassBase.prototype, ModelClassMark, { value: true });
