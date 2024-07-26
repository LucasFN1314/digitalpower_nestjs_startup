import { IsNotEmpty, IsString } from 'class-validator';

export default class usersDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  @IsNotEmpty()
  email: string;
}
