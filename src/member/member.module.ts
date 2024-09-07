import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { UploadModule } from 'src/upload/upload.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    UploadModule,
    JwtModule.register({}),
  ],
  controllers: [MemberController],
  providers: [MemberService, Reflector, JwtService],
})
export class MemberModule {}
