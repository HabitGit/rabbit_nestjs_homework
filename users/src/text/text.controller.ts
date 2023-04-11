import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {TextService} from "./text.service";
import {CreateTextDto} from "./dto/create-text.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {SearchTextDto} from "./dto/search-text.dto";
import {Roles} from "../guards/roles-auth.decorator";
import {RolesGuard} from "../guards/roles.guard";

@Controller('text')
export class TextController {

    constructor(private textService: TextService) {}

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() dto: CreateTextDto, @UploadedFile() image) {
        return this.textService.create(dto, image);
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put('/:id')
    @UseInterceptors(FileInterceptor('image'))
    update(@Body() dto: CreateTextDto, @Param('id') id: number, @UploadedFile() image) {
        return this.textService.update(dto, id, image);
    }

    @Get()
    get() {
        return this.textService.get();
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete('/:id')
    delete(@Param('id') id: number) {
        return this.textService.delete(id);
    }

    @Get('/filter')
    search(@Body() filter: SearchTextDto) {
        return this.textService.search(filter);
    }
}
