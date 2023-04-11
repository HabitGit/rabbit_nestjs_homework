import { Injectable } from '@nestjs/common';
import {User} from "../users/users.model";
import {JwtService} from "@nestjs/jwt";
import {InjectModel} from "@nestjs/sequelize";
import {Tokens} from "./token.model";

@Injectable()
export class TokenService {

    constructor(
        private jwtService: JwtService,
        @InjectModel(Tokens) private tokensModel: typeof Tokens,
        ) {}

    async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, role: user.role, rolesId: user.rolesId, profileId: user.profileId};
        return {
            accessToken: this.jwtService.sign(payload, {secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30m'}),
            refreshToken: this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d'})
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await this.tokensModel.findOne({where: {userId}});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return  await this.tokensModel.create({userId: userId, refreshToken: refreshToken});

    }

    async removeToken(refreshToken) {
        const tokenData = await this.tokensModel.findOne({where: {refreshToken: refreshToken}});
        return tokenData.destroy();
    }
}
