import { Controller, Inject, Module } from '@nestjs/common';
import { Model } from '../model/model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelController } from '../model/model.controller';
import { IsNotEmpty } from 'class-validator';
import { getService } from '../repository/repository';
import { ConfigModule } from '@nestjs/config';

const Test = new Model();
Test.setupDto('Test', {
  name: [IsNotEmpty()]
})
Test.setup('Test', {
  name: {
    type: 'varchar'
  }
});

@Controller('/test')
export class TestController extends ModelController {
  constructor(@Inject('TestService') public readonly service) {
    super(Test);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Test.schema]), ConfigModule.forRoot()],
  providers: [
    getService('TestService', Test)
  ],
  controllers: [TestController],
})
export class TestModule {}

