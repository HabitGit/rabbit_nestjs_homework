import {Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateProfileDto} from "./dto/create-profile.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {JwtService} from "@nestjs/jwt";
import {UpdateProfileDto} from "./dto/update.profile.dto";

@Injectable()
export class ProfileService {

    constructor(
        @InjectModel(Profile) private profileRepository: typeof Profile,
        private jwtService: JwtService,
        ) {}

    async create(dto: CreateProfileDto) {
        return await this.profileRepository.create(dto);
    }

    async update(data) {
        const dto: UpdateProfileDto = data;
        const userId = data.userId;
        const authHeader = data.authHeader;

        if(!authHeader) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }

        const profile = await this.profileRepository.findOne({where: {userId: userId}});
        const token = authHeader.split(' ')[1];
        const userVerify = this.jwtService.verify(token, {secret: process.env.JWT_ACCESS_SECRET});

        if(userVerify.id == userId || userVerify.rolesId == 2) {
            await profile.update(dto);
            return profile;
        }

        throw new UnauthorizedException({message: 'Вы не можете обновить этот профиль, так как он не ваш'});
    }

    async getProfiles() {
        const profiles = await this.profileRepository.findAll({include: {all: true}});
        return profiles;
    }

    async getOne(userId: number) {
        return await this.profileRepository.findOne({where: {userId: userId}});
    }

    async deleteProfile(profileId) {
        const profile = await this.profileRepository.findOne({where: {id: profileId}});
        return await profile.destroy();
    }
}
