import { FormModel, FormProp } from '@pebula/nform';

@FormModel()
export class Hero {
  @FormProp({
    render: { vType: 'text', label: 'Hero Name' }
  })
  name: string;

  @FormProp({
    render: { vType: 'boolean', label: 'Super Hero' }
  })
  superHero: boolean;
}
