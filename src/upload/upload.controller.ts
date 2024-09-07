import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('upload')
export class UploadController {
  @Post('profile-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './resource/image/photo',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}${extname(file.originalname)}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is missing');
    }

    const filePath = `resource/image/photo/${file.filename}`;

    // Return the path of the file saved in the directory
    return {
      originalName: file.originalname,
      fileName: file.filename,
      filePath: filePath,
    };
  }
}
