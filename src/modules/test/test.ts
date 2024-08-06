import { Controller, Injectable, Module } from '@nestjs/common';
import { Model } from '../model/model.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { ModelController } from '../model/model.controller';
import { IsNotEmpty } from 'class-validator';
import { RepositoryService } from '../repository/repository';
import { Repository } from 'typeorm';

const Test = new Model();
Test.setupDto('Test', {
  name: [IsNotEmpty()]
})
Test.setup('Test', {
  name: {
    type: 'varchar'
  }
});

@Injectable()
export class Service extends RepositoryService {
  constructor (@InjectRepository(Test.schema) repository: Repository<typeof Test.schema>){
    super(repository);
  }
}

@Controller('/test')
export class TestController extends ModelController {
  constructor(public readonly service: Service) {
    super(Test);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Test.schema])],
  providers: [Service],
  controllers: [TestController],
})
export class TestModule {}
