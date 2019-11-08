export const reflection = {
  designType(target: any, key: string | symbol | number): any {
    return (Reflect as any).getMetadata('design:type', target, key);
  },
  paramTypes(target: any, key: string | symbol | number) {
    return (Reflect as any).getMetadata('design:paramtypes', target, key);
  }
};

export function LazyInit(getter: Function): PropertyDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor?: PropertyDescriptor
  ) => {
    if (descriptor) {
      throw new Error('LazyInit can only decorate properties');
    }
    Object.defineProperty(target, propertyKey, {
      get() {
        const ret = getter.call(this);

        Object.defineProperty(this, propertyKey, { value: ret });
        return ret;
      }
    });
  };
}

/**
 * @pluginApi
 */
export const array = (function() {
  const findRemove = <T>(arr: T[], predicate: (value: T) => boolean, thisArg?: any): T | undefined => {
    const idx = arr.findIndex(predicate, thisArg);
    if (idx > -1) {
      return arr.splice(idx, 1)[0];
    }
  };

  return { findRemove };
})();

