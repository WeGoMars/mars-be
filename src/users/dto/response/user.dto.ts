

export class UserDto {
    id: number;
    email: string;
    nick: string;
    constructor(id: number, email: string, nick: string) {
        this.id=id;
        this.email=email;
        this.nick=nick;
    }
}