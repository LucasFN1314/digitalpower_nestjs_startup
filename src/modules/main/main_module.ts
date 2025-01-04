import { Controller, Inject, Module } from '@nestjs/common';
import { Model } from '../model/model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelController } from '../model/model.controller';
import { IsNotEmpty } from 'class-validator';
import { getService } from '../repository/repository';
import { ConfigModule } from '@nestjs/config';

const model = new Model();
model.setupDto('Model', {
  name: [IsNotEmpty()],
});
model.setup('Model', {
  name: {
    type: 'varchar',
  },
});

@Controller('/model')
export class modelController extends ModelController {
  constructor(@Inject('ModelService') public readonly service) {
    super(model);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([model.schema]), ConfigModule.forRoot()],
  providers: [getService('ModelService', model)],
  controllers: [modelController],
})
export class MainModule {}
