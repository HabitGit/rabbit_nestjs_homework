import {HttpException, HttpStatus, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import {ClientProxy} from "@nestjs/microservices";
import {CreateProfileDto} from "./dto/create-profile.dto";

@Injectable()
export class UsersService {

    constructor(
        @Inject("USERS_SERVICE") private readonly client: ClientProxy,
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService,
        private jwtService: JwtService,
        ) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue("USER")
        await user.$set('role', [role.id]);
        user.role = [role];
        return user;
    }

    async getUsers() {
        return await this.userRepository.findAll({include: {all: true}});
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({where: {email}, include: {all: true}})
    }

    async deleteUser(id: string, req) {

        const authHeader = req.headers.authorization;
        if(!authHeader) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }

        const user = await this.userRepository.findOne({where: {id}});
        if(!user) {
            throw new UnauthorizedException({message: 'Пользователь не существует'})
        }

        const token = authHeader.split(' ')[1];
        const userVerify = this.jwtService.verify(token, {secret: process.env.JWT_ACCESS_SECRET});
        if(userVerify.email == user.email || userVerify.rolesId == 2) {
            await this.client.send( { cmd: 'delete_profile' }, userVerify.profileId ).toPromise();
            return await user.destroy();
        }

        throw new UnauthorizedException({message: 'Вы не можете удалить этого пользователя, так как им не являетесь'});
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId, {include: {all: true}});
        const role = await this.roleService.getRoleByValue(dto.value);
        if(role && user) {
            await user.$set('role', role.id); // set перезаписывает значение
            return dto;
        }

        throw new HttpException('Пользователь или роль не нашлась', HttpStatus.NOT_FOUND)
    }

    async activation(activationLink) {
        const user = await this.userRepository.findOne({where: {activationLink}});
        if (!user) {
            throw new Error('Некорректная ссылка активации')
        }

        user.isActivated = true;
        await user.save();
    }

    async validateUser(userDto: CreateUserDto) {
        const user = await this.getUserByEmail((userDto.email));
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if(user && passwordEquals) {
            return user;
        }

        throw new UnauthorizedException({message: 'Некорректный емеил или пароль'})
    }

    async getAllProfiles() {
        return await this.client.send( { cmd: 'get_profiles' }, 'message' ).toPromise();
    }

    async getProfileByUserId(id) {
        return await this.client.send( { cmd: 'get_profile_by_id' }, id ).toPromise();
    }

    async updateProfileByUserId(dto: CreateProfileDto ,id: number, req) {
        const authHeader = req.headers.authorization;
        const data = {...dto, userId: id, authHeader: authHeader};
        return await this.client.send( { cmd: 'update_profile' }, data ).toPromise();
    }
}
