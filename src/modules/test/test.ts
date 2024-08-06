import { Controller, Injectable, Module } from '@nestjs/common';
import { Model } from '../model/model.entity';
import { ModelController } from '../model/model.controller';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Column, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { RepositoryService } from '../repository/repository';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Test extends Model {
  constructor() {
    super('Test');
    this.generateDto({
      name: [IsNotEmpty(), IsString()],
    });
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

@Injectable()
export class TestService extends RepositoryService {
  constructor(@InjectRepository(Test) public repository: Repository<Test>) {
    super();
  }
}

@Controller('/test')
export class TestController extends ModelController {
  constructor(public readonly service: TestService) {
    super(new Test());
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
