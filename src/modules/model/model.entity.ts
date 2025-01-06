import Dto from './dto';
import { EntitySchema } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class Model {
  public dto: Dto;
  public schema: EntitySchema;
  public service: any;

  constructor() {
  }

  SmartSetup (name: string, args: any[]) {
    this.dto = new Dto(name, SmartSetupDto());
    function SmartSetupDto () {
      let dto_args = {};
      args.forEach((arg) => {
        dto_args[arg] = [IsNotEmpty()];
      })
      return dto_args;
    }

    this.setup(name, SmartSetUp());
    function SmartSetUp (){
      let set_args = {};
      args.forEach((arg) => {
        set_args[arg] = {type: 'varchar'};
      })
      return set_args;
    }
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
