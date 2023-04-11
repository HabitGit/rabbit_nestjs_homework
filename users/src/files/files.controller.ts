import {Controller, Delete, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FilesService} from "./files.service";
import {Roles} from "../guards/roles-auth.decorator";
import {RolesGuard} from "../guards/roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('files')
export class FilesController {

    constructor(private fileService: FilesService) {}

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete('/cleaner')
    deleteNotUsage() {
        return this.fileService.deleteNotUsage();
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    addFile(@UploadedFile() file) {
        return this.fileService.addFile(file);
    }
}
