import {forwardRef, Module} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Roles} from "../roles/roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
      ClientsModule.register([
          {
              name: 'USERS_SERVICE',
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
      SequelizeModule.forFeature([User, Roles]),
      RolesModule,
      forwardRef(() => AuthModule)
  ],
    exports: [
        UsersService
    ]
})
export class UsersModule {}
