import { FormControl, FormGroup } from '@angular/forms';

import { TestTargetStore } from '@pebula/metap/testing';
import { FormModel, FormProp, NgFormsBoundMapper } from '@pebula/nform';

function createMapper(instance: any): NgFormsBoundMapper {
  return new NgFormsBoundMapper(instance.constructor, instance);
}

describe('@pebula/nform', () => {
  describe('ng-forms-bound-mapper', () => {

    const createUserModel = () => {
      @FormModel()
      class User {

        @FormProp()
        id: number;

        @FormProp()
        name: string;

        @FormProp()
        email: string;
      }
      return User;
    };

    afterEach(() => TestTargetStore.clearAll());


    it('should serialize to a FormGroup', () => {
      const User = createUserModel();
      const user = new User();
      const mapper = createMapper(user);
      const formGroup = mapper.serialize();
      expect(formGroup).toBeInstanceOf(FormGroup);
      expect(formGroup.get('id')).toBeInstanceOf(FormControl);
      expect(formGroup.get('name')).toBeInstanceOf(FormControl);
      expect(formGroup.get('email')).toBeInstanceOf(FormControl);
    });

    it('should serialize and deserialize the same instance', () => {
      const User = createUserModel();
      const user = new User();
      const mapper = createMapper(user);
      const formGroup = mapper.serialize();
      formGroup.get('id').setValue(1);
      formGroup.get('name').setValue('test');
      formGroup.get('email').setValue('test@test.com');
      const _user = mapper.deserialize();
      expect(user).toBe(_user);
      expect(user.id).toBe(1);
      expect(user.name).toBe('test');
      expect(user.email).toBe('test@test.com');
    });
  })
});
