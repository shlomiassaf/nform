// tslint:disable:max-classes-per-file
import {
  MetaClass,
  BaseMetadata,
  DecoratorInfo,
  ModelMetadata
} from '@pebula/utils/meta/internal';
import { Model } from '@pebula/utils/meta';

describe('@pebula/utils/meta', () => {
  describe('fw', () => {
    describe('@MetaClass()', () => {
      it('should run "onCreated"', () => {
        let runCount = 0;
        @MetaClass<any, TestMeMetadata>({
          onCreated: () => runCount += 1,
        })
        class TestMeMetadata extends BaseMetadata {
          constructor(obj: any, info: DecoratorInfo) {
            super(info);
          }
        }

        expect(runCount).toBe(1);

        const TestDecor = MetaClass.decorator(TestMeMetadata, 'class');

        @TestDecor({})
        @Model({})
        class User {}

        expect(runCount).toBe(1);
      });

    });
  });
});
