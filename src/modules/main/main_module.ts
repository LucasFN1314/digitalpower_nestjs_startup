import { ConfigModule } from '@nestjs/config';
import { Model } from '../model/model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getService } from '../repository/repository';
import { Controller, Inject, Module } from '@nestjs/common';
import { ModelController } from '../model/model.controller';

const model = new Model();
model.SmartSetup('model', ['name'])
/* Manual Way */
/*
model.setupDto('Model', {
  name: [IsNotEmpty()],
});
model.setup('Model', {
  name: {
    type: 'varchar',
  },
});
*/

@Controller('/api')
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
export class MainModule { }
