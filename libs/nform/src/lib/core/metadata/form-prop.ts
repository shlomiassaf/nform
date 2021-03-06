import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { stringify, Constructor } from '@pebula/utils';
import {
  MetaClass,
  PropMetadata,
  BaseMetadata,
  DecoratorInfo,
  TypeMetadataArgs,
  TypeMetadata,
  targetStore,
  LazyInit,
  MapExt
} from '@pebula/metap/internal';
import { RenderDef, FormElementType } from '../../types';
import { FormModelMetadata } from './form-model';

const FORM_MODEL_DECORATOR = Symbol('@FormModel');

export interface FormPropMetadataArgs<T extends keyof FormElementType = keyof FormElementType> extends RenderDef<T> {
  /**
   * Exclude this property from the form.
   * By default every class property decorated with @FormProp is included in the output of
   * a serialization process. Setting Exclude will make sure it is not part of the form.
   */
  exclude?: boolean;

  /**
   * Transform the value before it serialize or deserialize.
   * Use the `direction` to determine the operation (serialize / deserialize).
   *
   *   - form: Direction is from model to form (serialization). The value comes from the model instance.
   *   - model: Direction is from form to model (deserialization). The value comes from the form control (i.e. when committing)
   *
   * > Note that when defined on an array, the transform function will trigger for every array item and not the array itself.
   */
  transform?: (value: any, direction: 'form' | 'model') => any;

  /**
   * Sugar for adding a required validator
   */
  required?: boolean;

  /**
   * Flattens the rendering of an object or an array of objects into the root so they are rendered in the root level
   * with other properties on the instance.
   *
   * A flattening definitions is a key -> value map where key's are the properties of the type decorated and the values
   * are [[FormPropMetadataArgs]] for each property, it's sort of manual form control definition for a type.
   *
   * A flatten definition is defined on [[[[FormPropMetadataArgs]]]] and creates internal [[FormPropMetadataArgs]]
   * values so we can say that it is recursive, i.e. you can define a flatten definition with one or more of the
   * children having flatten definitions of their own and the same for the children of the children...
   *
   * Notice that flattening apply only on the rendering, it does not change the structure of the model and the generated
   * form structure is identical to the model structure.
   *
   * The library will manage the transformation to and from the UI.
   *
   * ## Arrays
   * When a flatten definition decorates an Array of T the array should be ignored and the definition should reflect the
   * type of T, the fact that the type is and Array of T should not make a difference and the library will take that
   * into account.
   *
   * NOTE: When decorating an Array of T, make sure to include the type, either in `@Prop` metadata or in the
   * `rtType` property in [[FormPropMetadataArgs]] or it will register as Array<Object>.
   *
   * > Must decorate an object or array of objects, primitives are not allowed.
   * Instructions for flattening the object referenced on this property.
   * The property must reference a JS object.
   *
   * flatten properties does not require a render records.
   * When set, the property is treated as a plain object regardless of it's type so you can also send plain JS objects.
   *
   * NOTE: [[FormPropMetadataArgs]] definitions in a flatten record might not support all features.
   *       If you want to maximize use make sure to manually define the run-time types.
   */
  flatten?: { [key: string]: FormPropMetadataArgs };

  /**
   * Declares the property as a nested child form.
   * The property type must a complex object.
   * This has no effect on UI rendering, only used by the mapper.
   */
  childForm?: boolean;

  /**
   * When set true will force the mapper to treat this property as a generic `Object`.
   * This means that when the model will serialize to a `Form` this property will serialize to a `FormControl` regardless
   * of it's actual type.
   *
   * > Note: Setting this will override any `type` or `rtType` set.
   *
   * This is syntax sugar for
   * ```
   * @FormProp({
   *   reType: { isArray: false },
   *   render: {
   *     vType: 'text',
   *     label: 'Developer Name'
   *   }
   * })
   * name: string[];
   */
  forceObjectType?: true;

  /**
   * Type definition declaration to be used by the form builder.
   * Setting type definition overrides any existing type definition, explicit or implicit.
   *
   * ## When to use:
   * The library identifies the type automatically (implicit) but you can also use the `@FormProp` decorator and explicitly set the type.
   *
   * When `rType` is not set the library will use the existing type information from typescript's reflection.
   * This is the recommended approach but it limited since typescript's reflection is not mature enough in certain edge cases.
   *
   * The existing type information is usually enough but in some cases it requires manual definition done in using
   * the `@FormProp` decorator, these are the most common scenarios:
   *   - Circular module dependency
   *   SEE https://stackoverflow.com/questions/50894571/what-does-do-forwardref-in-angular
   *   - When using `this` or `any` type
   *   - When using Array of T (e.g. `string[]` or `Array<number>`)
   *   SEE https://github.com/Microsoft/TypeScript/issues/7169
   *
   * It might be that you will need `rtType` in other scenarios, if so remember that it will override all existing type
   * information for the form builder only.
   *
   * ## How to use:
   * The builder will auto-set missing or unset type information, if exists.
   * Set [[TypeDefinition.ref]] property to the type, or a type getter function.
   * Set [[TypeDefinition.forwardRef]] property to true, only then using type getter function in `ref`
   * Set [[TypeDefinition.isArray]] property when defining a property in a `flatten` definition or when the type
   * annotation for the property is not an array, otherwise this value is automatically set by the builder
   *
   * SEE [[TypeMetadataArgs]] for more information
   */
  rtType?: TypeMetadataArgs;

  /**
   * The default value
   */
  defaultValue?: any;

  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
}

export const BASE_RENDERER: RenderDef = {
  vType: 'none',
  ordinal: Number.MAX_SAFE_INTEGER
};

// @dynamic
@MetaClass<FormPropMetadataArgs, FormPropMetadata>({
  allowOn: ['member'],
  extend: 'mergeMap',
  // proxy: { host: PropMetadata, containerKey: 'form' },
  onCreated: () => {
    targetStore.on.processType((target: Constructor<any>) => {
      const tMeta = targetStore.getTargetMeta(target);
      const modelProps = tMeta.getMetaFor(FormPropMetadata);
      if (modelProps) {
        let formModelMeta = tMeta.getMetaFor(FormModelMetadata, true);
        if (!formModelMeta) {
          FormPropMetadata[FORM_MODEL_DECORATOR](target);
          formModelMeta = tMeta.getMetaFor(FormModelMetadata, true);
        }

        // In here we add every property decorated with @FormProp
        // into the FormModelMetadata and in the process create PropMetadata to each FormPropMetadata
        for (const [k, v] of MapExt.asKeyValArray(modelProps)) {
          formModelMeta.addProp(PropMetadata.getCreateProp(tMeta, k as any), v)
        }
      }
    });
  },
})
export class FormPropMetadata extends BaseMetadata {

  @LazyInit( () => MetaClass.decorator(FormModelMetadata, true)() )
  private static [FORM_MODEL_DECORATOR]: (target: any) => any;

  transform: (value: any, direction: 'form' | 'model') => any;
  exclude: boolean;
  required: boolean;
  defaultValue: any;
  render: RenderDef;
  validators: ValidatorFn | ValidatorFn[] | null;
  asyncValidators: AsyncValidatorFn | AsyncValidatorFn[] | null;
  childForm: boolean;
  flatten?: { [key: string]: FormPropMetadata };
  rtType?: TypeMetadata;

  constructor(metaArgs: FormPropMetadataArgs, info: DecoratorInfo, target?: Constructor<any>) {
    super(info);
    this.render = { ...BASE_RENDERER };
    if (metaArgs) {
      this.transform = metaArgs.transform;
      this.exclude = metaArgs.exclude;
      if (metaArgs.hasOwnProperty('defaultValue')) {
        this.defaultValue = metaArgs.defaultValue;
      }

      this.required = metaArgs.required;
      this.validators = metaArgs.validators || null;
      this.asyncValidators = metaArgs.asyncValidators || null;
      if (!this.exclude) {
        if (!metaArgs.vType && !metaArgs.flatten) {
          throw new Error(`Invalid property type or type not set in ${stringify(target)}.${info.name.toString()}`);
        }
        for (const key of ['ordinal', 'label', 'vType', 'data']) {
          if (key in metaArgs) {
            this.render[key] = metaArgs[key];
          }
        }
      }

      if (metaArgs.childForm) {
        // TODO: If childForm, check type and see type is a FormModel as well
        //       This requires some thinking because at this point the type might be undefined if it's a getter.
        if (!this.render.vType) {
          this.render.vType = 'form';
        }
        this.childForm = true;
      }

      if (metaArgs.forceObjectType === true) {
        this.rtType = new TypeMetadata({ container: undefined }, info, target);
      } else if (metaArgs.rtType) {
        this.rtType = new TypeMetadata(metaArgs.rtType, info, target);
      }

      if (metaArgs.flatten) {
        this.flatten = {};
        for (let key of Object.keys(metaArgs.flatten)) {
          this.flatten[key] = new FormPropMetadata(metaArgs.flatten[key], {
            type: 'member',
            name: key
          });
        }
      }
    }
  }

  static EMPTY = new FormPropMetadata({ vType: 'none' } as any, { type: 'class' });
}

/* For the proxy */

// declare module '@pebula/metap/internal/lib/metadata/prop' {
//   interface PropMetadataArgs {
//     form?: FormPropMetadataArgs | undefined;
//   }
// }
