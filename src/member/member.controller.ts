import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Request } from 'express';
import { ApiMaster, ApiMember } from 'src/constant';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PageableDto } from 'src/common/dto/pageable.dto';
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller(ApiMaster)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post(ApiMember)
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      storage: diskStorage({
        destination: './resources/images/photos',
        filename: (req, file, cb) => {
          const fileExtName = path.extname(file.originalname);
          const randomName = uuidv4();
          cb(null, `${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  create(
    @Body() createMemberDto: CreateMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    let profilePhotoPath: string = '';

    if (file) {
      profilePhotoPath = `resource/image/photo/${file.filename}`;
    }

    // Ambil email dari JWT payload
    const user = request.user as JwtPayload;
    createMemberDto.createdBy = user.email;
    createMemberDto.profilePhoto = profilePhotoPath; // Simpan path photo ke database

    return this.memberService.create(createMemberDto);
  }

  @Get(ApiMember)
  findAll(@Query() query: PageableDto) {
    return this.memberService.findAll(query);
  }

  @Get(ApiMember + '/:id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Patch(ApiMember + '/:id')
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      storage: diskStorage({
        destination: './resources/images/photos',
        filename: (req, file, cb) => {
          const fileExtName = path.extname(file.originalname);
          const randomName = uuidv4();
          cb(null, `${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    let profilePhotoPath: string = '';

    if (file) {
      profilePhotoPath = `resource/image/photo/${file.filename}`;
    }

    // Ambil email dari JWT payload
    const user = request.user as JwtPayload;
    updateMemberDto.updatedBy = user.email;
    updateMemberDto.profilePhoto = profilePhotoPath; // Simpan path photo ke database
    return this.memberService.update(id, updateMemberDto);
  }

  @Delete(ApiMember + '/:id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }
}
