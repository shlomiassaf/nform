import { FormControl, FormGroup, FormArray } from '@angular/forms';

import { TestTargetStore } from '@pebula/metap/testing';
import { FormModel, FormProp, NgFormsBoundMapper, NFormFactoryService } from '@pebula/nform';

describe('@pebula/nform', () => {
  describe('NForm', () => {
    describe('formProxy', () => {
      let nformFactory: NFormFactoryService;

      beforeEach(() => {
        nformFactory = new NFormFactoryService();
      });

      afterEach(() => TestTargetStore.clearAll());


      it('should proxy a simple model', () => {
        @FormModel()
        class User {
          @FormProp() id: number;
          @FormProp() name: string;
          @FormProp() email: string;
        }
        const user = new User();
        const nform = nformFactory.create(user);
        const proxy = nform.formProxy;

        proxy.email = 'email';
        proxy.name = 'name';

        expect(nform.form.get('email').value).toBe(proxy.email);
        expect(nform.form.get('name').value).toBe(proxy.name);

        expect(user.email).not.toBe(proxy.email);
        expect(user.name).not.toBe(proxy.name);

        nform.commitToModel(false);

        expect(user.email).toBe(proxy.email);
        expect(user.name).toBe(proxy.name);

        nform.form.get('email').setValue('email-changed');
        expect(proxy.email).toBe('email-changed');
      });

      it('should proxy a single flattening definition', () => {
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
        const nform = nformFactory.create(user);
        const proxy = nform.formProxy;

        proxy.id = 1;
        proxy.address = {
          street: 'Test St',
          city: 'testomania',
          zip: 123
        };

        const { form } = nform;
        expect(form.get('address')).toBeInstanceOf(FormGroup);
        expect(form.get('id').value).toBe(proxy.id);
        expect(form.get('address.street').value).toBe('Test St');
        expect(form.get('address').value).toEqual({ ...proxy.address });

        proxy.address.zip = 999;
        expect(form.get('address.zip').value).toBe(999);

        form.get('address.zip').setValue(888);
        expect(proxy.address.zip).toBe(888);
      });

      it('should proxy an array flattening definition', () => {
        @FormModel()
        class Address {
          @FormProp() street: string;
          @FormProp() city: string;
          @FormProp() zip: number;
        }

        @FormModel()
        class User {
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
        const nform = nformFactory.create(user);
        const proxy = nform.formProxy;

        proxy.addresses = [
          { street: '1 Test St', city: 'testomania1', zip: 123 },
          { street: '2 Test St', city: 'testomania2', zip: 456 }
        ];

        const { form } = nform;

        expect(proxy.addresses).toBeInstanceOf(Array);
        expect(form.get('addresses')).toBeInstanceOf(FormArray);
        expect(form.get('addresses').value).toEqual(proxy.addresses.map( a => { return { ...a }; }));

        proxy.addresses[0].zip = 999;

        expect(form.get('addresses.0.zip').value).toBe(999);

        form.get('addresses.0.zip').setValue(888);
        expect(proxy.addresses[0].zip).toBe(888);
      });

      it('should proxy an array childForm definition', () => {
        @FormModel()
        class Address {
          @FormProp() street: string;
          @FormProp() city: string;
          @FormProp() zip: number;
        }

        @FormModel()
        class User {
          @FormProp({
            vType: 'none',
            childForm: true,
            rtType: () => Address
          })
          addresses: Address[];
        }

        const user = new User();
        const nform = nformFactory.create(user);
        const proxy = nform.formProxy;

        proxy.addresses = [
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

        const { form } = nform;

        expect(proxy.addresses).toBeInstanceOf(Array);
        expect(form.get('addresses')).toBeInstanceOf(FormArray);
        expect(form.get('addresses').value).toEqual(proxy.addresses.map( a => { return { ...a }; }));

        proxy.addresses[0].zip = 999;

        expect(form.get('addresses.0.zip').value).toBe(999);

        form.get('addresses.0.zip').setValue(888);
        expect(proxy.addresses[0].zip).toBe(888);
      });

      it('should support array methods on proxy array', () => {
        @FormModel()
        class Address {
          @FormProp() street: string;
          @FormProp() city: string;
          @FormProp() zip: number;
        }

        @FormModel()
        class User {
          @FormProp({
            vType: 'none',
            childForm: true,
            rtType: () => Address
          })
          addresses: Address[];
        }

        const user = new User();
        const nform = nformFactory.create(user);
        const proxy = nform.formProxy;

        proxy.addresses = [
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

        const { form } = nform;

        proxy.addresses.push(Object.assign(new Address(), {
          street: '3 Test St',
          city: 'testomania3',
          zip: 777
        }));

        expect(proxy.addresses.length).toBe(3);
        expect(form.get('addresses').value).toEqual(proxy.addresses.map( a => { return { ...a }; }));

        const popped = proxy.addresses.pop();
        expect(popped.street).toBe('3 Test St');
        expect(proxy.addresses.length).toBe(2);
        expect(form.get('addresses').value).toEqual(proxy.addresses.map( a => { return { ...a }; }));

        const shifted = proxy.addresses.shift();
        expect(shifted.street).toBe('1 Test St');
        expect(proxy.addresses.length).toBe(1);
        expect(form.get('addresses').value).toEqual(proxy.addresses.map( a => { return { ...a }; }));

        proxy.addresses.unshift(Object.assign(new Address(), {
          street: '3 Test St',
          city: 'testomania3',
          zip: 777
        }));

        expect(proxy.addresses[0].street).toBe('3 Test St');
        expect(proxy.addresses.length).toBe(2);
        expect(form.get('addresses').value).toEqual(proxy.addresses.map( a => { return { ...a }; }));
      });

    });
  })
});
