import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private jwtService: JwtService,
                private reflector: Reflector) {} // рефлектор для того что бы доставать роли

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]); // два параметра нужны что бы рефлектор понимал какие данные ему нужно доставать

            if (!requiredRoles) {
                return true;
            }

            const req = context.switchToHttp().getRequest() // получаем объект реквеста из контекста
            const authHeader = req.headers.authorization; // вытаскиваем хедер который состоит из двух частей. Первая это тип токена а вторая сам токен
            const bearer = authHeader.split(' ')[0]; // вытаскиваем тип
            const token = authHeader.split(' ')[1]; // вытаскиваем токен

            if(bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const user = this.jwtService.verify(token) // раскодировка токена
            req.user = user;
            return requiredRoles.includes(user.role.value);

        } catch (e) {
            throw new HttpException({message: 'Нет доступа'}, HttpStatus.FORBIDDEN)
        }
    }

}