import {forwardRef, Module} from '@nestjs/common';
import { FilesService } from './files.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Files} from "./file.model";
import { FilesController } from './files.controller';
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [FilesService],
  exports: [FilesService],
  imports: [
      SequelizeModule.forFeature([Files]),
      forwardRef(() => AuthModule),
  ],
  controllers: [FilesController]
})
export class FilesModule {}
