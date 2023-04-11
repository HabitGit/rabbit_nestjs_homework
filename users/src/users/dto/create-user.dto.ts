
export class CreateUserDto {
    readonly email: string;
    readonly password: string;
    readonly isActivated: boolean;
    readonly activationLink: string;
}