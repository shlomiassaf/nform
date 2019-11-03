import { Constructor } from './mixin';
import { isFunction } from './checks';

/**
 * Returns the chain of prototypes up to Object (not included)
 * @pluginApi
 * @param cls
 */
export function getProtoChain(cls: Constructor<any>): Array<Constructor<any>> {
  const classes = [];
  while (cls && cls !== Object) {
    classes.push(cls);

    const proto = Object.getPrototypeOf(cls.prototype);
    cls = isFunction(proto) || !proto ? proto : proto.constructor;
  }
  return classes;
}

export function getBaseClass(cls: Constructor<any>): Constructor<any> | void {
  const proto = Object.getPrototypeOf(cls.prototype);
  return !proto || isFunction(proto) ? proto : proto.constructor;
}
