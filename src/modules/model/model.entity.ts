import Dto from './dto';
import { Entity } from 'typeorm';

@Entity()
export class Model {
  public dto: Dto;
  public className: string;

  constructor(className: string) {
    this.className = className;
  }

  generateDto(properties: { [key: string]: any[] }) {
    this.dto = new Dto(this.className, properties);
  }
}
