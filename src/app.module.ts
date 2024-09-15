import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { CategoryModule } from './category/category.module';
import { PublisherModule } from './publisher/publisher.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Book } from './book/entities/book.entity';
import { Category } from './category/entities/category.entity';
import { Publisher } from './publisher/entities/publisher.entity';
import { Member } from './member/entities/member.entity';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { BorrowModule } from './borrow/borrow.module';
import { TransactionModule } from './transaction/transaction.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DATABASE'),
        entities: [User, Role, Book, Category, Publisher, Member],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
      MemberModule,
      BookModule,
      UserModule,
      RoleModule,
      CategoryModule,
      PublisherModule,
    ]),
    MemberModule,
    BookModule,
    UserModule,
    RoleModule,
    CategoryModule,
    PublisherModule,
    AuthModule,
    UploadModule,
    BorrowModule,
    TransactionModule,
    ReviewModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
