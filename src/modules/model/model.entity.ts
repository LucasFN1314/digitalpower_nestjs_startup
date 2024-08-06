import Dto from './dto';
import { EntitySchema } from 'typeorm';

export class Model {
  public dto: Dto;
  public schema: EntitySchema;
  public service: any;

  constructor() {
  }

  setupDto (name, args) {
    this.dto = new Dto(name, args);
  }

  setup (name: string, args?: any) {
    this.schema = new EntitySchema({
      name: name,
      columns: {
        id: {
          type: 'int',
          primary: true,
          generated: true,
        },
        ...args,
      },
    });
    //this.service = createService(this.schema);
  }
}
