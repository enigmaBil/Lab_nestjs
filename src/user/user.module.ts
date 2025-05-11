import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { User } from './entities/user.entity';
import { SharedJwtModule } from 'src/common/modules/jwt/jwt.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]), MailModule, SharedJwtModule],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
