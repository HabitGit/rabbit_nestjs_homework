import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {FilesModule} from "../files/files.module";
import {MailerModule} from "../mailer/mailer.module";
import {TokenModule} from "../token/token.module";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      ClientsModule.register([
          {
              name: 'AUTH_SERVICE',
              transport: Transport.RMQ,
              options: {
                  urls: ['amqp://rabbitmq:5672'],
                  queue: 'users_queue',
                  queueOptions: {
                      durable: false
                  },
              },
          },
      ]),
      MailerModule,
      JwtModule,
      TokenModule,
      forwardRef(() => UsersModule),
      forwardRef(() => FilesModule),
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
