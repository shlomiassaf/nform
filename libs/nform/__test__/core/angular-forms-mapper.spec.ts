import { fakeAsync, tick } from '@angular/core/testing';
import { FormArray, FormGroup, FormControl, AbstractControl } from '@angular/forms';

import { Constructor } from '@pebula/utils';
import { TestTargetStore } from '@pebula/metap/testing';
import { Model, Exclude, Prop } from '@pebula/metap';
import * as utilsMeta from '@pebula/metap';
import { FormModel, FormProp, ngFormsMapper, cloneControl, createControl } from '@pebula/nform';
import { FormPropMetadataArgs } from '../../src/lib/core/metadata/form-prop';

function serialize(instance: any): FormGroup {
  return utilsMeta.serialize(ngFormsMapper.serializer(instance), instance.constructor);
}

function deserialize<T, Z>(formGroup: FormGroup, type: Z & Constructor<T>): T {
  return utilsMeta.deserialize(ngFormsMapper.deserializer(formGroup, type));
}

interface IAddress {
  street: string;
  city: string;
  zip: number;
}

declare module '@pebula/nform/lib/types/form-element-type' {
  interface FormElementType {
    text: never;
  }
}


describe('@pebula/nform', () => {
  describe('angular-forms-mapper', () => {
    const createUserModel = () => {
      @FormModel()
      class User {
        @FormProp() id: number;

        @FormProp() name: string;

        @FormProp() email: string;
      }
      return User;
    };
    afterEach(() => TestTargetStore.clearAll());

    it('should throw when a target is not decorated with @FormModel', () => {
      expect(() => {
        @Model()
        class DemoForm {}

        serialize(new DemoForm());
      }).toThrowError("Target 'DemoForm' is not a registered FormModel");
    });

    it('should serialize to a FormGroup', () => {
      const User = createUserModel();
      const user = new User();
      const formGroup = serialize(user);
      expect(formGroup).toBeInstanceOf(FormGroup);
      expect(formGroup.get('id')).toBeInstanceOf(FormControl);
      expect(formGroup.get('name')).toBeInstanceOf(FormControl);
      expect(formGroup.get('email')).toBeInstanceOf(FormControl);
    });

    it('should serialize and deserialize the same instance', () => {
      const User = createUserModel();
      const user = new User();
      const formGroup = serialize(user);
      formGroup.get('id').setValue(1);
      formGroup.get('name').setValue('test');
      formGroup.get('email').setValue('test@test.com');
      const _user = deserialize(formGroup, User);
      expect(user).not.toBe(_user);
      expect(_user.id).toBe(1);
      expect(_user.name).toBe('test');
      expect(_user.email).toBe('test@test.com');
    });

    it('should apply exclude logic', () => {
      @FormModel()
      class ExcludedFormCases {
        @Exclude()
        @FormProp()
        modelExcluded: string;

        @FormProp({
          vType: 'none',
          exclude: true
        })
        formExcluded: string;

        @FormProp() inForm: string;
      }
      const formGroup = serialize(new ExcludedFormCases());
      expect(formGroup.get('formExcluded')).toBeNull();
      expect(formGroup.get('modelExcluded')).toBeInstanceOf(FormControl);
      expect(formGroup.get('inForm')).toBeInstanceOf(FormControl);
    });

    it('should apply transformation', () => {
      @FormModel()
      class TransformationFormCases {
        @FormProp({
          vType: 'none',
          transform: (value: any, dir: 'form' | 'model') => dir === 'form' ? JSON.stringify(value) : JSON.parse(value),
        })
        alwaysTest: object;
      }

      const instance = new TransformationFormCases();
      instance.alwaysTest = { a: 'b', c: 1 };

      const formGroup = serialize(instance);
      expect(formGroup.get('alwaysTest').value).toBe(JSON.stringify(instance.alwaysTest));

      const newValue = { d: 'e', f: 3 };
      formGroup.get('alwaysTest').setValue(JSON.stringify(newValue))
      expect(deserialize(formGroup, TransformationFormCases).alwaysTest).toEqual(newValue);
    });

    it('should apply defaultValue logic', () => {
      @FormModel()
      class DefaultValueFormCases {
        @FormProp({
          vType: 'none',
          defaultValue: 'defaultValue'
        })
        inFormPreSet: string = '';

        @FormProp({
          vType: 'none',
          defaultValue: 'defaultValue'
        })
        inForm: string;
      }

      const formGroup = serialize(new DefaultValueFormCases());
      expect(formGroup.get('inForm').value).toEqual('defaultValue');
      expect(formGroup.get('inFormPreSet').value).toEqual('');
    });

    it('should map complex objects based on childForm', () => {
      const obj = { x: 1, y: 2 };

      @FormModel()
      class DemoForm {
        @FormProp({
           vType: 'text',
          childForm: true
        })
        complexObject1: any = obj;

        @FormProp({
          vType: 'text',
          childForm: false
        })
        complexObject2: any = obj;
      }

      const fg = serialize(new DemoForm());

      // childForm: true -> complex object is converted into a FormGroup
      expect(fg.get('complexObject1')).toBeInstanceOf(FormGroup);
      expect(fg.get('complexObject1').value).not.toBe(obj);
      expect(fg.get('complexObject1').value.x).toEqual(obj.x);
      expect(fg.get('complexObject1').value.y).toEqual(obj.y);

      // childForm: false -> complex object is converted into a FormControl, user responsible for rendering.
      expect(fg.get('complexObject2')).toBeInstanceOf(FormControl);
      expect(fg.get('complexObject2').value).toBe(obj);
    });

    it('should map known models based on childForm', () => {
      @FormModel()
      class DemoChildForm {
        @FormProp() val1: boolean;
        @FormProp() val2: number;
        @FormProp() val3: string;
      }

      const obj = new DemoChildForm();
      obj.val1 = true;
      obj.val2 = 10;
      obj.val3 = 'test';

      @FormModel()
      class DemoForm {
        @FormProp({
          vType: 'none',
          childForm: true
        })
        child1: DemoChildForm = obj;

        @FormProp({
          vType: 'none',
          childForm: false
        })
        child2: DemoChildForm = obj;
      }

      const fg = serialize(new DemoForm());

      // childForm: true -> complex object is converted into a FormGroup
      expect(fg.get('child1')).toBeInstanceOf(FormGroup);
      expect(fg.get('child1').value).not.toBe(obj);
      expect(fg.get('child1').get('val1').value).toEqual(obj.val1);
      expect(fg.get('child1').get('val2').value).toEqual(obj.val2);
      expect(fg.get('child1').get('val3').value).toEqual(obj.val3);

      // childForm: false -> complex object is converted into a FormControl, user responsible for rendering.
      expect(fg.get('child2')).toBeInstanceOf(FormControl);
      expect(fg.get('child2').value).toBe(obj);
    });

    it('should add required validation', () => {
      @FormModel()
      class DemoForm {
        @FormProp({
          vType: 'form',
          required: true
        })
        required: string;
      }

      const required = serialize(new DemoForm()).get('required');

      required.updateValueAndValidity();
      expect(required.hasError('required')).toEqual(true);

      required.setValue('test');
      expect(required.hasError('required')).toEqual(false);
    });

    it('should add custom validation', () => {
      @FormModel()
      class DemoForm {
        @FormProp({
          vType: 'none',
          validators: [
            (value: AbstractControl) => {
              if (value.value === 'fail') {
                return {
                  myCustomValidator: 'myCustomValidator failed'
                };
              } else {
                return null;
              }
            },
            (value: AbstractControl) => {
              return {
                alwaysFail: 'alwaysFail failed'
              };
            }
          ]
        })
        required: string;
      }

      const required = serialize(new DemoForm()).get('required');

      required.updateValueAndValidity();
      expect(required.hasError('alwaysFail')).toEqual(true);
      expect(required.errors['alwaysFail']).toEqual('alwaysFail failed');
      expect(required.hasError('myCustomValidator')).toEqual(false);

      required.setValue('fail');
      expect(required.hasError('alwaysFail')).toEqual(true);
      expect(required.errors['alwaysFail']).toEqual('alwaysFail failed');
      expect(required.hasError('myCustomValidator')).toEqual(true);
      expect(required.errors['myCustomValidator']).toEqual(
        'myCustomValidator failed'
      );
    });

    it(
      'should add custom async validation',
      fakeAsync(() => {
        @FormModel()
        class DemoForm {
          @FormProp({
            vType: 'none',
            asyncValidators: [
              (value: AbstractControl) => {
                return Promise.resolve(null).then(() => {
                  if (value.value === 'fail') {
                    return {
                      myCustomValidator: 'myCustomValidator failed'
                    };
                  } else {
                    return null;
                  }
                });
              },
              (value: AbstractControl) =>
                Promise.resolve(null).then(() => ({
                  alwaysFail: 'alwaysFail failed'
                }))
            ]
          })
          required: string;
        }

        const required = serialize(new DemoForm()).get('required');
        expect(required.valid).toBe(true);
        expect(required.pending).toBe(false);

        required.updateValueAndValidity();

        expect(required.pending).toBe(true);
        tick();
        expect(required.pending).toBe(false);
        expect(required.valid).toBe(false);
        expect(required.hasError('alwaysFail')).toEqual(true);
        expect(required.errors['alwaysFail']).toEqual('alwaysFail failed');
        expect(required.hasError('myCustomValidator')).toEqual(false);

        required.setValue('fail');
        tick();
        expect(required.hasError('alwaysFail')).toEqual(true);
        expect(required.errors['alwaysFail']).toEqual('alwaysFail failed');
        expect(required.hasError('myCustomValidator')).toEqual(true);
        expect(required.errors['myCustomValidator']).toEqual(
          'myCustomValidator failed'
        );
      })
    );

    describe('Arrays', () => {
      afterEach(() => TestTargetStore.clearAll());

      it('should serialize and deserialize array of primitives', () => {
        @FormModel()
        class User {
          @FormProp() id: number;

          @Prop({
            type: () => String
          })
          @FormProp()
          names: string[];

          @FormProp({
            vType: 'none',
            rtType: () => String
          })
          notSetArray: string[];
        }

        const user = new User();
        user.id = 1;
        user.names = ['john', 'doe'];

        const formGroup = serialize(user);
        expect(formGroup).toBeInstanceOf(FormGroup);
        expect(formGroup.get('id')).toBeInstanceOf(FormControl);
        expect(formGroup.get('names')).toBeInstanceOf(FormArray);
        expect(formGroup.get('notSetArray')).toBeInstanceOf(FormArray);

        let controls = (formGroup.get('names') as FormArray).controls;
        expect(controls.length).toBe(2);
        expect(controls[0]).toBeInstanceOf(FormControl);
        expect(controls[0].value).toBe('john');
        expect(controls[1]).toBeInstanceOf(FormControl);
        expect(controls[1].value).toBe('doe');

        controls = (formGroup.get('notSetArray') as FormArray).controls;
        expect(controls.length).toBe(0);

        (formGroup.get('names') as FormArray).removeAt(1);
        (formGroup.get('names') as FormArray).push(new FormControl('philip'));

        const _user = deserialize(formGroup, User);
        expect(_user).toBeInstanceOf(User);
        expect(user).not.toEqual(_user);

        user.notSetArray = [];
        user.names.pop();
        user.names.push('philip');
        expect(user).toEqual(_user);
      });

      it('should serialize and deserialize array of child forms', () => {
        @FormModel()
        class Address {
          @FormProp() street: string;

          @FormProp() city: string;

          @FormProp() zip: number;
        }

        @FormModel()
        class User {
          @FormProp() id: number;

          @FormProp({
            vType: 'none',
            childForm: true,
            rtType: () => Address
          })
          addresses: Address[];
        }

        const user = new User();
        user.id = 1;
        user.addresses = [
          Object.assign(new Address(), {
            street: '1 Test St',
            city: 'testomania1',
            zip: 123
          }),
          Object.assign(new Address(), {
            street: '2 Test St',
            city: 'testomania2',
            zip: 456
          })
        ];

        const formGroup = serialize(user);
        expect(formGroup).toBeInstanceOf(FormGroup);
        expect(formGroup.get('id')).toBeInstanceOf(FormControl);
        expect(formGroup.get('addresses')).toBeInstanceOf(FormArray);

        let controls = (formGroup.get('addresses') as FormArray).controls;
        expect(controls.length).toBe(2);
        expect(controls[0]).toBeInstanceOf(FormGroup);
        expect((controls[0] as FormGroup).getRawValue()).toEqual(
          user.addresses[0]
        );
        expect(controls[1]).toBeInstanceOf(FormGroup);
        expect((controls[1] as FormGroup).getRawValue()).toEqual(
          user.addresses[1]
        );

        const thirdAddress = {
          street: '3 Test St',
          city: 'testomania3',
          zip: 456
        };
        (formGroup.get('addresses') as FormArray).removeAt(1);
        (formGroup.get('addresses') as FormArray).push(
          serialize(Object.assign(new Address(), thirdAddress))
        );

        const _user = deserialize(formGroup, User);
        expect(_user).toBeInstanceOf(User);
        expect(user).not.toEqual(_user);
        user.addresses.pop();
        user.addresses.push(Object.assign(new Address(), thirdAddress));
        expect(user).toEqual(_user);
      });
    });

    describe('flattening', () => {
      afterEach(() => TestTargetStore.clearAll());

      it('should serialize and deserialize flatten definitions', () => {
        @FormModel()
        class Address {
          @FormProp() street: string;

          @FormProp() city: string;

          @FormProp() zip: number;
        }

        @FormModel()
        class User {
          @FormProp() id: number;

          @FormProp({
            vType: 'none',
            flatten: {
              street: {
                vType: 'text',
                required: true
              },
              city: {
                vType: 'text',
                required: true
              },
              zip: { vType: 'text' }
            }
          })
          address: Address;
        }

        const user = new User();
        user.id = 1;
        user.address = {
          street: 'Test St',
          city: 'testomania',
          zip: 123
        };

        const formGroup = serialize(user);
        expect(formGroup).toBeInstanceOf(FormGroup);
        expect(formGroup.get('id')).toBeInstanceOf(FormControl);
        expect(formGroup.get('address')).toBeInstanceOf(FormGroup);
        expect(formGroup.get('address.street')).toBeInstanceOf(FormControl);
        expect(formGroup.get('address.city')).toBeInstanceOf(FormControl);
        expect(formGroup.get('address.zip')).toBeInstanceOf(FormControl);

        const _user = deserialize(formGroup, User);
        expect(_user).toBeInstanceOf(User);
        expect(user).toEqual(_user);
      });

      it('should serialize and deserialize array of flatten definition', () => {
        @FormModel()
        class Address {
          @FormProp() street: string;

          @FormProp() city: string;

          @FormProp() zip: number;
        }

        @FormModel()
        class User {
          @FormProp() id: number;

          @FormProp({
            vType: 'none',
            flatten: {
              street: {
                vType: 'text',
                required: true
              },
              city: {
                vType: 'text',
                required: true
              },
              zip: { vType: 'text' }
            }
          })
          addresses: Address[];
        }

        const user = new User();
        user.id = 1;
        user.addresses = [
          { street: '1 Test St', city: 'testomania1', zip: 123 },
          { street: '2 Test St', city: 'testomania2', zip: 456 }
        ];

        const formGroup = serialize(user);
        expect(formGroup).toBeInstanceOf(FormGroup);
        expect(formGroup.get('id')).toBeInstanceOf(FormControl);
        expect(formGroup.get('addresses')).toBeInstanceOf(FormArray);

        let controls = (formGroup.get('addresses') as FormArray).controls;
        expect(controls.length).toBe(2);
        expect(controls[0]).toBeInstanceOf(FormGroup);
        expect((controls[0] as FormGroup).getRawValue()).toEqual(
          user.addresses[0]
        );
        expect(controls[1]).toBeInstanceOf(FormGroup);
        expect((controls[1] as FormGroup).getRawValue()).toEqual(
          user.addresses[1]
        );

        // cloning without a value supplied
        const thirdAddress = {
          street: '3 Test St',
          city: 'testomania3',
          zip: 456
        };
        const thirdAddressFormGroup = cloneControl(controls[0] as FormGroup);
        Object.keys(thirdAddress).forEach(k => {
          thirdAddressFormGroup.get(k).setValue(thirdAddress[k]);
        });
        (formGroup.get('addresses') as FormArray).push(thirdAddressFormGroup);

        // cloning with a value supplied
        const fourthAddress = {
          street: '4 Test St',
          city: 'testomania4',
          zip: 789
        };
        const fourthAddressFormGroup = cloneControl(controls[0] as FormGroup, fourthAddress);
        (formGroup.get('addresses') as FormArray).push(fourthAddressFormGroup);

        const _user = deserialize(formGroup, User);
        expect(_user).toBeInstanceOf(User);
        expect(user).not.toEqual(_user);
        user.addresses.push(thirdAddress);
        user.addresses.push(fourthAddress);
        expect(user).toEqual(_user);
      });

      it('should serialize and deserialize array of flatten definitions with nested flatten definitions', () => {
        interface AddressWithAdditional extends IAddress {
          additional: {
            work: Address;
            other: Address[];
          };
        }

        const basicFlatten: FormPropMetadataArgs['flatten'] = {
          street: {
            vType: 'text',
            required: true
          },
          city: {
            vType: 'text',
            required: true
          },
          zip: { vType: 'text' }
        };

        @FormModel()
        class Address {
          @FormProp() street: string;

          @FormProp() city: string;

          @FormProp() zip: number;
        }

        @FormModel()
        class User {
          @FormProp() id: number;

          @FormProp({
            vType: 'none',
            flatten: {
              ...basicFlatten,
              additional: {
                flatten: {
                  work: {
                    flatten: {
                      ...basicFlatten
                    },
                  },
                  other: {
                    flatten: {
                      ...basicFlatten
                    },
                  }
                }
              }
            },
          })
          addresses: AddressWithAdditional[];
        }

        let counter = 1;
        const createAddress = (id: number): Address => {
          return { street: `${id} Test St`, city: 'testomania', zip: 123 };
        };

        const user = new User();
        user.id = 1;
        user.addresses = [
          Object.assign(createAddress(++counter), {
            additional: {
              work: createAddress(++counter),
              other: [
                createAddress(++counter),
                createAddress(++counter),
                createAddress(++counter)
              ]
            }
          }),
          Object.assign(createAddress(++counter), {
            additional: {
              work: createAddress(++counter),
              other: [
                createAddress(++counter),
                createAddress(++counter),
                createAddress(++counter)
              ]
            }
          })
        ];

        const formGroup = serialize(user);
        expect(formGroup).toBeInstanceOf(FormGroup);
        expect(formGroup.get('id')).toBeInstanceOf(FormControl);
        expect(formGroup.get('addresses')).toBeInstanceOf(FormArray);
        expect((formGroup.get('addresses') as FormArray).controls.length).toBe(2);

        user.addresses.forEach((address, idx) => {
          expect(formGroup.get(`addresses.${idx}.additional`)).toBeInstanceOf(FormGroup);
          expect(formGroup.get(`addresses.${idx}.additional.work`)).toBeInstanceOf(FormGroup);
          expect(formGroup.get(`addresses.${idx}.additional.other`)).toBeInstanceOf(FormArray);
          expect((formGroup.get(`addresses.${idx}.additional.other`) as FormArray).controls.length).toBe(3);
          user.addresses[idx].additional.other.forEach((address, idx2) => {
            expect(formGroup.get(`addresses.${idx}.additional.other.${idx2}`)).toBeInstanceOf(FormGroup);
          });
        });

        const _user = deserialize(formGroup, User);
        expect(_user).toBeInstanceOf(User);
        expect(user).toEqual(_user);
      });
    });

    describe('createControl', () => {
      interface AddressWithAdditional extends IAddress {
        additional: {
          work: IAddress;
          other: IAddress[];
        };
      }

      const basicFlatten: FormPropMetadataArgs['flatten'] = {
        street: {
          vType: 'text',
          required: true
        },
        city: {
          vType: 'text',
          required: true
        },
        zip: { vType: 'text' }
      };

      let User: any;
      let user: any;
      let counter = 0;
      const createAddress = (id: number): IAddress => {
        return { street: `${id} Test St`, city: 'testomania', zip: 123 };
      };

      beforeEach(() => {
        @FormModel()
        class Address {
          @FormProp() street: string;

          @FormProp() city: string;

          @FormProp() zip: number;
        }

        @FormModel()
        class MyChildChildModel {
          @FormProp({
            vType: 'none',
            flatten: {
              ...basicFlatten,
              additional: {
                flatten: {
                  work: {
                    flatten: { ...basicFlatten },
                  },
                  other: {
                    flatten: { ...basicFlatten },
                  }
                },
              },
            },
          })
          addressCollection: AddressWithAdditional[];
        }

        @FormModel()
        class MyChildModel {
          @FormProp({
            vType: 'none',
            childForm: true
          })
          childModel: MyChildChildModel;
        }

        @FormModel()
        class _User {
          @FormProp() id: number;

          @FormProp({
            vType: 'none',
            flatten: {
              ...basicFlatten,
              additional: {
                flatten: {
                  work: {
                    flatten: { ...basicFlatten },
                  },
                  other: {
                    rtType: {
                      container: Array,
                    },
                    flatten: { ...basicFlatten },
                  }
                }
              }
            }
          })
          addresses: AddressWithAdditional[];

          @FormProp({
            vType: 'none',
            childForm: true
          })
          childModel: MyChildModel;
        }

        counter = 0;
        User = _User;
        user = new _User();
        user.id = 1;
        user.addresses = [
          Object.assign(createAddress(++counter /* 1 */), {
            additional: {
              work: createAddress(++counter /* 2 */),
              other: [
                createAddress(++counter /* 3 */),
                createAddress(++counter /* 4 */),
                createAddress(++counter /* 5 */)
              ]
            }
          }),
          Object.assign(createAddress(++counter /* 6 */), {
            additional: {
              work: createAddress(++counter /* 7 */),
              other: [
                createAddress(++counter /* 8 */),
                createAddress(++counter /* 9 */),
                createAddress(++counter /* 10 */)
              ]
            }
          })
        ];

        user.childModel = new MyChildModel();
        user.childModel.childModel = new MyChildChildModel();
        user.childModel.childModel.addressCollection = [
          Object.assign(createAddress(++counter /* 11 */), {
            additional: {
              work: createAddress(++counter /* 12 */),
              other: [
                createAddress(++counter /* 13 */),
                createAddress(++counter /* 14 */),
                createAddress(++counter /* 15 */)
              ]
            }
          })
        ];
      });

      it('should create a form group from a property with flatten expression of Array', () => {
        const manual = createControl(User, 'addresses');
        expect(manual).toBeInstanceOf(FormGroup);
        expect(manual.get(`additional`)).toBeInstanceOf(FormGroup);
        expect(manual.get(`additional.work`)).toBeInstanceOf(FormGroup);
        expect(manual.get(`additional.other`)).toBeInstanceOf(FormArray);
        expect((manual.get(`additional.other`) as FormArray).length).toBe(0);
      });

      it('should create and populate a form control from a property with flatten expression of Array', () => {
        const formGroup = serialize(user);
        const manual = new FormArray(
          user.addresses.map(addr => createControl(User, 'addresses', addr))
        );
        expect(manual.getRawValue())
          .toEqual( (formGroup.get(`addresses`) as FormArray).getRawValue() );
      });

      it('should create a form control from a nested property using a deep path ', () => {
        const manual = createControl(User, ['addresses', 'additional.other']);
        expect(manual).toBeInstanceOf(FormGroup);
        expect(manual.get('street')).toBeInstanceOf(FormControl);
        expect(manual.get('city')).toBeInstanceOf(FormControl);
        expect(manual.get('zip')).toBeInstanceOf(FormControl);
      });

      it('should create and populate a form control from a nested property using a deep path ', () => {
        const formGroup = serialize(user);
        const manual = createControl(User, ['addresses', 'additional.other'], createAddress(10)) as FormGroup;

        expect(manual.getRawValue()).toEqual( (formGroup.get(`addresses.1.additional.other.2`) as FormArray).getRawValue() );
      });

      it('should create a form control from a nested property starting with a childForm and then a flatten expression', () => {
        const manual = createControl(User, [
          'childModel',
          'childModel.addressCollection.additional.other'
        ]);
        expect(manual).toBeInstanceOf(FormGroup);
        expect(manual.get('street')).toBeInstanceOf(FormControl);
        expect(manual.get('city')).toBeInstanceOf(FormControl);
        expect(manual.get('zip')).toBeInstanceOf(FormControl);
      });

      it('should create and populate a form control from a nested property starting with a childForm and then a flatten expression', () => {
        const formGroup = serialize(user);
        const manual = createControl(User, ['childModel', 'childModel.addressCollection.additional.other'], createAddress(15)) as FormGroup;

        expect(manual.getRawValue())
          .toEqual( (formGroup.get(`childModel.childModel.addressCollection.0.additional.other.2`) as FormArray).getRawValue() );
      });
    });
  });
});
