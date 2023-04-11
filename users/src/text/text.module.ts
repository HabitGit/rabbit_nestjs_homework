import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Texts} from "./text.model";
import {FilesModule} from "../files/files.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [TextService],
  controllers: [TextController],
  imports: [
    SequelizeModule.forFeature([Texts]),
      FilesModule,
      AuthModule
  ]
})
export class TextModule {}
