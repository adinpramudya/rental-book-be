import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './resources/images/photos',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
