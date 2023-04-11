import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import {CreateFileDto} from "./dto/create-file.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Files} from "./file.model";

@Injectable()
export class FilesService {

    constructor(@InjectModel(Files) private filesRepository: typeof Files) {
    }

    async createFile(file, data: CreateFileDto): Promise<string> {
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '..', 'static')

            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }

            if (!file || !file.buffer) {
                await this.filesRepository.create({fileName: null, ...data});
                return null;
            }

            if ( await this.filesRepository.findOne({where: {fileName}})) {
                throw new HttpException({message: 'Такой файл уже существует'}, HttpStatus.INTERNAL_SERVER_ERROR)
            }
            await fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            await this.filesRepository.create({fileName: fileName, ...data});
            return fileName;

        } catch (e) {
            throw new HttpException('Ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteFile(fileName) {
        const filePath = path.resolve(__dirname, '..', 'static');
        fs.rmSync(path.join(filePath, fileName));
        const findFile = await this.filesRepository.findOne({where: {fileName}});
        await findFile.destroy();
    }

    async deleteNotUsage() {
        const files = await this.filesRepository.findAll();
        const dateNow = new Date();

        for (let i of files) {
            const dateBefore = i.createdAt;

            if (dateNow.getTime() - dateBefore.getTime() >= 3600000
                || !i.essenceId
                || !i.essenceTable) {
                const filePath = path.resolve(__dirname, '..', 'static');
                fs.rmSync(path.join(filePath, i.fileName));
            }
        }
        return files;
    }

    async addFile(file) {
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '..', 'static');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }

            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            await this.filesRepository.create({fileName: fileName});
            return fileName;

        } catch (e) {
            throw new HttpException('Ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
