import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import {JwtModule} from "@nestjs/jwt";
import {SequelizeModule} from "@nestjs/sequelize";
import {Tokens} from "./token.model";

@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [
      JwtModule,
      SequelizeModule.forFeature([Tokens]),
  ]
})
export class TokenModule {}
