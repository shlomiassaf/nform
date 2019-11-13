import { FormModel, FormProp } from '@pebula/nform';

@FormModel()
export class Hero {
  @FormProp({ vType: 'text', label: 'Hero Name' } )
  name: string;

  @FormProp({
    vType: 'date',
    label: 'Hero Birth'
  })
  birth: string;

  @FormProp({ vType: 'boolean', label: 'Super Hero' })
  superHero: boolean;

  @FormProp({
    vType: 'slider',
    label: 'BMI Index',
    data: { min: 1, max: 35 }
  })
  bmi: number;
}
