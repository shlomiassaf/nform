import { Model, FormProp } from '@pebula/nform';

@Model({ form: true })
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
