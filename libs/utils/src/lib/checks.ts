export function isNumber(obj: any): obj is number {
  return typeof obj === 'number';
}

export function isString(obj: any): obj is string {
  return typeof obj === 'string';
}

export function isFunction(obj: any): obj is Function {
  return typeof obj === 'function';
}

export function isStaticDecorator(target: any): boolean {
  return isFunction(target);
}

const undef = undefined;
export function isUndefined(obj: any): obj is undefined {
  return obj === undef;
}

export function ensureTargetIsType(type: any): any {
  return isFunction(type) ? type : type.constructor;
}

export function isJsObject(obj: any): boolean {
  return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
}
export function isPrimitive(obj: any): boolean {
  return !isJsObject(obj);
}

/**
 * See https://github.com/angular/angular/blob/2.0.0-rc.4/modules/%40angular/facade/src/lang.ts#L149
 * @param token
 * @returns
 */
export function stringify(token: any): string {
  if (typeof token === 'string') {
    return token;
  }

  if (token === undefined || token === null) {
    return '' + token;
  }

  if (token.name) {
    return token.name;
  }
  if (token.overriddenName) {
    return token.overriddenName;
  }

  const res = token.toString();
  const newLineIndex = res.indexOf('\n');
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
