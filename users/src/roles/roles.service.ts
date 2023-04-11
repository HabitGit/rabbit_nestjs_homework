import { Injectable } from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Roles} from "./roles.model";

@Injectable()
export class RolesService {

    constructor(@InjectModel(Roles) private roleRepository: typeof Roles) {} // Иньекция модели

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        return role;
    }
}
