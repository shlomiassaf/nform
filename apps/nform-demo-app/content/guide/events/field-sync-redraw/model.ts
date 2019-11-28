import { FormModel, FormProp } from '@pebula/nform';

@FormModel()
export class Hero {
  @FormProp({
    vType: 'number',
    label: 'Hero ID'
  })
  id: number;

  @FormProp({
    required: true,
    vType: 'text',
    label: 'Hero Name'
  })
  name: string;

  @FormProp({
    vType: 'select',
    label: 'Super Power',
    data: {
      multiple: true,
      options: [
        { value: 'selfHealing', label: 'Self Healing' },
        { value: 'flying', label: 'Flying' },
      ]
    }
  })
  superPower: 'selfHealing' | 'flying' | 'cloaking' | 'cloning' | 'invisibility';
}
