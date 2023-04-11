import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid'
import {MailerService} from "../mailer/mailer.service";
import {TokenService} from "../token/token.service";
import {ClientProxy} from "@nestjs/microservices";
import {FilesService} from "../files/files.service";
import {CreateProfileDto} from "../users/dto/create-profile.dto";

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private fileService: FilesService,
        private tokenService: TokenService,
        private mailerService: MailerService,
        @Inject("AUTH_SERVICE") private readonly client: ClientProxy,
        ) {}

    async login(userDto: CreateUserDto) {
        const user = await this.userService.validateUser(userDto);
        const tokens = await this.tokenService.generateToken(user);
        await this.tokenService.saveToken(user.id, tokens.refreshToken);
        return {...tokens, user};
    }

    async registration(userDto: CreateUserDto, profileUserDto: CreateProfileDto, avatar) {

        const candidate = await this.userService.getUserByEmail(userDto.email);
        if(candidate) {
            throw new HttpException('Такой пользователь уже зарегистрирован', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await bcrypt.hash(userDto.password, 3);
        const activationLink = uuid.v4();

        const user = await this.userService.createUser({...userDto, password: hashPassword, activationLink: activationLink});
        // await this.mailerService.sendActivationMail(userDto.email, `${process.env.API_URL}/users/activate/${activationLink}`);
        const data = {essenceTable: 'user', essenceId: user.id};
        const fileName = await this.fileService.createFile(avatar, data);
        const profileData = {...profileUserDto, userId: user.id, avatar: fileName};
        const profile = await this.client.send({ cmd: 'create_profile' }, profileData).toPromise();
        user.profileId = profile.id;
        await user.save();
        const tokens = await this.tokenService.generateToken(user);
        await this.tokenService.saveToken(user.id, tokens.refreshToken);
        return {...tokens, user: user};
    }

    async logout(refreshToken) {
        const token = await this.tokenService.removeToken(refreshToken);
        return token;
    }
}
