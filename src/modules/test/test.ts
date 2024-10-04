import {
  Body,
  Controller, Get,
  HttpStatus,
  Inject, MiddlewareConsumer,
  Module, Param,
  Post, RequestMethod, Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Model } from '../model/model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelController } from '../model/model.controller';
import { IsNotEmpty } from 'class-validator';
import { getService } from '../repository/repository';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthMiddleware } from '../../middleware/auth';
const File = new Model();
File.setupDto('File', {
  name: [IsNotEmpty()],
});
File.setup('File', {
  name: {
    type: 'varchar',
  },
});

@Controller('/')
export class TestController extends ModelController {
  private readonly chunkDir = path.join('./', 'temp');

  constructor(@Inject('FileService') public readonly service) {
    super(File);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body('chunkIndex') chunkIndex: number,
    @Body('totalChunks') totalChunks: number,
    @Body('filename') filename: string,
    @Body('sitename') sitename: string,
  ) {
    if (!fs.existsSync(this.chunkDir)) {
      fs.mkdirSync(this.chunkDir);
    }
    const dir = path.join(
      this.chunkDir,
      `chunk-${sitename}-${filename}-${chunkIndex}`,
    );
    fs.writeFileSync(dir, file.buffer);

    if (chunkIndex == totalChunks - 1) {
      this.combineChunks(filename, totalChunks, sitename);
    }
    return HttpStatus.OK;
  }

  @Post('/sites')
  async sites() {
    let dir = path.join('./', 'uploads');
    return fs.readdirSync(dir);
  }

  @Get("/download/:site/:filename")
  async download (
    @Param('site') sitename: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = path.join('./uploads', sitename, filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath, filename, (err) => {
        if (err) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error al descargar el archivo');
        }
      });
    } else {
      res.status(HttpStatus.NOT_FOUND).send('Archivo no encontrado');
    }
  }

  private combineChunks(
    filename: string,
    totalChunks: number,
    sitename: string,
  ) {
    const uploadDir = path.join('./', 'uploads/' + sitename);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, filename);
    const writeStream = fs.createWriteStream(filePath);

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(
        this.chunkDir,
        `chunk-${sitename}-${filename}-${i}`,
      );
      const chunkData = fs.readFileSync(chunkPath);
      writeStream.write(chunkData);
      fs.unlinkSync(chunkPath);
    }
    writeStream.end();
    writeStream.on('finish', () => {
      console.log(`File ${filename} built!`);
    });
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([File.schema]), ConfigModule.forRoot()],
  providers: [getService('FileService', File)],
  controllers: [TestController],
})
export class FileModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/sites', method: RequestMethod.ALL },
        { path: '/upload', method: RequestMethod.ALL },
      );
  }
}
