import { Injectable } from '@nestjs/common';
import {CreateTextDto} from "./dto/create-text.dto";
import {InjectModel} from "@nestjs/sequelize";
import {FilesService} from "../files/files.service";
import {Texts} from "./text.model";
import {SearchTextDto} from "./dto/search-text.dto";

@Injectable()
export class TextService {

    constructor(@InjectModel(Texts) private textRepository: typeof Texts,
                private fileService: FilesService) {
    }

    async create(dto: CreateTextDto, image) {
        const textBlock = await this.textRepository.create(dto);
        if(image) {
            const data = {essenceTable: 'Texts', essenceId: textBlock.id};
            const fileName = await this.fileService.createFile(image, data);
            textBlock.image = fileName;
            await textBlock.save();
            return textBlock;
        }
        return textBlock;
    }

    async update(dto: CreateTextDto, id: number, image) {
        const textBlock = await this.textRepository.findByPk(id);
        if (!image) {
            await textBlock.update(dto);
            return textBlock;
        }
        const oldFileName = textBlock.image;
        await this.fileService.deleteFile(oldFileName);
        const data = {essenceTable: 'Texts', essenceId: id}
        const fileName = await this.fileService.createFile(image, data);
        await textBlock.update(({...dto, image: fileName}));
        return textBlock;
    }

    async get() {
        const textBlocks = await this.textRepository.findAll({include: {all: true}});
        return textBlocks;
    }

    async delete(id: number) {
        const textBlock = await this.textRepository.findOne({where: {id}});

        if (textBlock.image) {
            await this.fileService.deleteFile(textBlock.image);
        }

        return await textBlock.destroy();
    }

    async search(filter : SearchTextDto) {
        if (filter.uniqueName) {
            const uniqueName = filter.uniqueName;
            return await this.textRepository.findOne({where: {uniqueName}});

        } else if (filter.page) {
            const page = filter.page;
            return await this.textRepository.findAll({where: {page}, include: {all: true}});

        } else if (filter.header) {
            const header = filter.header;
            return await this.textRepository.findAll({where: {header}, include: {all: true}});

        }
    }
}
