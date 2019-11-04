import { Model, Prop } from '@pebula/utils/meta';
import { targetStore, PropMetadata } from '@pebula/utils/meta/internal';
import { TestTargetStore } from '@pebula/utils/testing';
import { FormModel, FormProp } from '@pebula/nform';

import {
  FormModelMetadata,
  FormPropMetadata
} from '@pebula/nform/lib/core/index';

function getFormMeta(target: any): FormModelMetadata {
  return targetStore.getMetaFor(target, FormModelMetadata, true);
}

describe('@pebula/nform', () => {
  describe('decorators', () => {
    describe('@FormModel()', () => {
      afterEach(() => TestTargetStore.clearAll());

      it('should register metadata', () => {
        @Model()
        @FormModel()
        class DemoForm {
          @Prop() notInForm: string;
          @Prop()
          @FormProp()
          inForm: string;
        }

        const meta = getFormMeta(DemoForm);
        expect(meta).toBeInstanceOf(FormModelMetadata);

        expect(meta.getProp('notInForm')).toBeUndefined();
        expect(meta.getProp('inForm')).toBeInstanceOf(FormPropMetadata);
      });

      it('should automatically register @FormModel if not set but @FormProp is set', () => {
        @Model()
        class DemoForm {
          @FormProp() inForm: string;
        }

        const meta = getFormMeta(DemoForm);
        expect(meta).toBeInstanceOf(FormModelMetadata);

        expect(meta.getProp('inForm')).toBeInstanceOf(FormPropMetadata);
      });

      it('should automatically register @Prop when @FormProp is set without @Prop', () => {
        @Model()
        @FormModel()
        class DemoForm {
          @FormProp() inForm: string;
        }

        expect(getFormMeta(DemoForm).getProp('inForm')).toBeInstanceOf(
          FormPropMetadata
        );
        expect(
          targetStore.getMetaFor(DemoForm, PropMetadata, 'inForm')
        ).toBeInstanceOf(PropMetadata);
      });

      it('should throw when type is not set and no basic type match found', () => {
        function create() {
          class OtherType {}

          @Model()
          @FormModel()
          class DemoForm {
            @FormProp({
              render: {
                vType: undefined,
                label: 'label'
              }
            })
            otherType: OtherType;
          }
        }

        expect(create).toThrowError(
          'Invalid property type or type not set in DemoForm.otherType'
        );
      });
    });
  });
});
