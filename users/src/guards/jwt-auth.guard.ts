import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest() // получаем объект реквеста из контекста
        try {
            const authHeader = req.headers.authorization; // вытаскиваем хедер который состоит из двух частей. Первая это тип токена а вторая сам токен
            const bearer = authHeader.split(' ')[0]; // вытаскиваем тип
            const token = authHeader.split(' ')[1]; // вытаскиваем токен

            if(bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const user = this.jwtService.verify(token) // раскодировка токена
            req.user = user;
            return true;
        } catch (e) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
    }

}