import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {Roles} from "../guards/roles-auth.decorator";
import {RolesGuard} from "../guards/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {Request} from "express";

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService,
        ) {}

    @Post()
    create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
    }

    @Get()
    getAll() {
        return this.usersService.getUsers();
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(@Param('id') id: string, @Req() req: Request) {
        return this.usersService.deleteUser(id, req);
    }

    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.usersService.addRole(dto);
    }

    @Get('/activate/:link')
    activation(@Param('link') link: string) {
        return this.usersService.activation(link);
    }

    @Get('/profiles')
    getAllProfiles() {
        return this.usersService.getAllProfiles();
    }

    @Get('/:id/profile')
    getProfileByUserId(@Param('id') id) {
        return this.usersService.getProfileByUserId(id);
    }

    @Put('/:id/profile')
    updateProfileByUserId(
        @Param('id') id: number,
        @Body() dto: CreateProfileDto,
        @Req() req: Request,
        ) {
        return this.usersService.updateProfileByUserId(dto, id, req);
    }
}
