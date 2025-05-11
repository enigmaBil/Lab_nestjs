import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

    async sendWelcomeEmail(email: string, name: string, password: string) {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Bienvenue sur GYM-APP',
        template: 'account-created',
        context: {
          name,
          email,
          password,
        }
      }
    )
  }

}
