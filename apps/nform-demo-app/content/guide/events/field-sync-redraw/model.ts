import { FormModel, FormProp } from '@pebula/nform';

@FormModel()
export class Hero {
  @FormProp({ vType: 'text', label: 'Hero Name' } )
  name: string;

  @FormProp({ vType: 'boolean', label: 'Super Hero' })
  superHero: boolean;
}
