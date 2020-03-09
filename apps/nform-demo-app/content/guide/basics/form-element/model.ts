import { FormModel, FormProp } from '@pebula/nform';
import { Prop } from '@pebula/metap';

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
    vType: 'date',
    label: 'Hero Birth'
  })
  birth: string;

  @FormProp({
    vType: 'boolean',
    label: 'Has Tracking Device'
  })
  hasTracking: boolean;

  @FormProp({
    vType: 'slideToggle',
    label: 'Double Agent'
  })
  doubleAgent: boolean;
}
