import { isFunction } from '@pebula/utils';
import { TargetMetadata, BaseSerializer, BaseDeserializer, targetStore, array } from '@pebula/utils/meta/internal';
import { TransformationError } from './errors';
import { TargetSerializationContext } from './target-serialization-context';

const targetSerializationContextStore = new Map<TargetMetadata, TargetSerializationContext>();

function getTargetSerializationContext(targetMeta: TargetMetadata): TargetSerializationContext {
  let ctx = targetSerializationContextStore.get(targetMeta);
  if (!ctx) {
    ctx = new TargetSerializationContext(targetMeta);
    targetSerializationContextStore.set(targetMeta, ctx);
  }
  return ctx;
}

export function serializeTargetMeta<TMeta extends TargetMetadata = any>(targetMeta: TMeta, mapper: BaseSerializer): any {
  return getTargetSerializationContext(targetMeta).serialize(mapper);
}

export function deserializeTargetMeta<TMeta extends TargetMetadata = any>(targetMeta: TMeta,
                                                                          mapper: BaseDeserializer,
                                                                          target: any | any[],
                                                                          plain: boolean = false): void {
  if (mapper.isCollection) {
    if (!Array.isArray(target)) {
      throw TransformationError.coll_obj(true);
    }

    const refItems = target.splice(0, target.length);
    const identKey = targetStore.getIdentityKey(targetMeta.target, 'incoming');

    while (mapper.next()) {
      let t: any;

      // compare current item to map with a list of items that if we, if we got.
      // if match use that instance.
      // TODO: Move compare to the global store, so logic can change without bugs.
      if (refItems.length > 0 && isFunction(mapper.getIdentity)) {
        const incomingIdent = mapper.getIdentity();
        t = array.findRemove(
          refItems,
          item => item[identKey] === incomingIdent
        );
      }

      if (!t) {
        t = plain ? {} : targetMeta.model().factory(false);
      }

      getTargetSerializationContext(targetMeta).deserialize(mapper, t);
      target.push(t);
    }
  } else {
    if (Array.isArray(target)) {
      throw TransformationError.coll_obj(false);
    }

    getTargetSerializationContext(targetMeta).deserialize(mapper, target);
  }
}
