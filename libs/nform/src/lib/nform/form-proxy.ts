import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { targetStore } from '@pebula/metap/internal';

import { FormModelMetadata } from '../core/metadata/form-model';
import { FormPropMetadata } from '../core/metadata/form-prop';
import { NForm } from './nform';

const THIS_FORM_CONTEXT = Symbol('This Form Context');

class FormProxyContext {
  public get parent(): FormProxyContext | undefined { return this._parent; }
  private _parent: FormProxyContext;

  constructor(public form: FormGroup | FormArray,
              public readonly nform: import('./nform').NForm,
              public readonly path?: string) {}


  createChildContext(name: string, form: FormGroup | FormArray): FormProxyContext {
    const ctx = new FormProxyContext(form, this.nform, name);
    ctx._parent = this;
    return ctx;
  }
}

export type FormProxy<T = any> = { [THIS_FORM_CONTEXT]: FormProxyContext; } & T;

export function createFormProxy<T>(nform: NForm<T>): FormProxy<T> {
  const formMeta = targetStore.getMetaFor(nform.type, FormModelMetadata, true)
  const props = formMeta.getProps()
    .map( ([p, formProp]) => [p.name as string, formProp] as [string, FormPropMetadata] );

  const context = new FormProxyContext(nform.form, nform);
  return createProxy<T>(context, props);
}

function createProxy<T = any>(context: FormProxyContext, props: Array<[string, FormPropMetadata]>): FormProxy<T> {
  const proxy: FormProxy<T> = {} as any;
  Object.defineProperty(proxy, THIS_FORM_CONTEXT, { value: context, enumerable: false, writable: false, configurable: false })

  for (let [name, formProp] of props) {
    createProxyProp(proxy, name, formProp);
  }

  return proxy;
}

function createProxyProp(proxy: FormProxy, name: string, formProp: FormPropMetadata, ignoreArray = false) {
  const { flatten, rtType } = formProp;
  const isArray = !!rtType && rtType.container === Array;
  const context: FormProxyContext = proxy[THIS_FORM_CONTEXT];

  if (isArray && !ignoreArray) {
    const childContext = context.createChildContext(name, context.form.get(name) as FormArray)
    const childProxy = createFormArrayProxy(childContext, formProp);
    Object.defineProperty(proxy, name, {
      enumerable: true,
      get: () => childProxy,
      set: value => Object.assign(childProxy, value),
    });
  } else if (flatten) {
    const childContext = context.createChildContext(name, context.form.get(name) as FormGroup)
    const childProxy = createProxy(childContext, Object.entries(flatten));
    Object.defineProperty(proxy, name, {
      enumerable: true,
      get: () => childProxy,
      set: value => Object.assign(childProxy, value),
    });
  } else {
    if (formProp.childForm) {
      const type = rtType && rtType.ref;
      const formMeta = type && targetStore.getMetaFor(type, FormModelMetadata, true);
      if (formMeta) {
        const props = formMeta.getProps()
          .map( ([p, formProp]) => [p.name as string, formProp] as [string, FormPropMetadata] );

        const childContext = context.createChildContext(name, context.form.get(name) as FormGroup);

        const childProxy = createProxy(childContext, props);
        Object.defineProperty(proxy, name, {
          enumerable: true,
          get: () => childProxy,
          set: value => Object.assign(childProxy, value),
        });
        return;
      }
    }

    Object.defineProperty(proxy, name, {
      enumerable: true,
      get: function() { return this[THIS_FORM_CONTEXT].form.get(name).value; },
      set: function(value: any) { this[THIS_FORM_CONTEXT].form.get(name).setValue(value); },
    });
  }
}

function createControlFromContext(context: FormProxyContext, value: any): FormGroup | FormControl {
  const path: string[] = [];
  while (context.path) {
    path.unshift(context.path);
    context = context.parent;
  }
  return context.nform.createControl(path, value, true);
}

function createFormArrayProxy<T = any>(context: FormProxyContext, formProp: FormPropMetadata): Array<T> {
  const arrayChangeHandler: ProxyHandler<FormProxy<Array<T>>> = {
    get: function(target: FormProxy<Array<T>>, property: string | symbol | number, receiver: FormProxy<Array<T>>) {
      if (typeof property === 'symbol')
        property = String(property);

      if (typeof property === 'number' || (property as any).match(/^\d/)) {
        if (property >= target.length) {
          createProxyProp(target, property as any, formProp, true);
        }
        return target[property];
      } else {
        const form = context.form as FormArray;
        switch (property) {
          case 'length':
            return form.length;
          case 'push':
            return function (...value: any[]) {
              let idx = form.length;
              for (const val of value) {
                form.push(createControlFromContext(context, val));
                receiver[idx] = form.at(idx).value;
                idx += 1;
              }
              return form.length;
            }
          case 'pop':
            return function () {
              const idx = form.length - 1;
              const ctrl = form.at(idx);
              if (ctrl) {
                form.removeAt(idx);
                target.pop();
                return ctrl.value;
              }
            }
          case 'unshift':
            return function (...value: any[]) {
              for (const val of value) {
                form.insert(0, createControlFromContext(context, val));
              }
              target.length = 0;
              for (let i = 0; i < form.length; i++) {
                receiver[i] = form.at(i).value;
              }
              return form.length;
            }
          case 'shift':
            return function () {
              const ctrl = form.at(0);
              if (ctrl) {
                form.removeAt(0);
                const ret = ctrl.value;
                target.length = 0;
                for (let i = 0; i < form.length; i++) {
                  receiver[i] = form.at(i).value;
                }
                return ret;
              }
            }
        }

        const val = target[property];
        if (typeof val === 'function') {
          return function () {
            return val.apply(receiver, arguments);
          }
        }
      }
    },
    set: function(target: FormProxy<Array<T>>, property: string | symbol | number, value: T, receiver: FormProxy<Array<T>>) {
      if (typeof property === 'symbol')
        property = String(property);

      if (typeof property === 'number' || property.match(/^\d/)) {
        if (property >= target.length) {
          const ctrl = createControlFromContext(context, value);
          (context.form as FormArray).setControl(Number(property), ctrl);
          createProxyProp(target, property as any, formProp, true);
        }
        target[property] = value;
      } else {
        if (property === 'length') {
          (context.form as FormArray).clear();
          target.length = 0;
        }
      }
      return true;
    }
  };

  const proxy: FormProxy<Array<T>> = [] as any;
  Object.defineProperty(proxy, THIS_FORM_CONTEXT, { value: context, enumerable: false, writable: false, configurable: false });
  return new Proxy<FormProxy<Array<T>>>(proxy, arrayChangeHandler);
}
