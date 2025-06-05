

export class UserDto {
    id: number;
    email: string;
    nick: string;
    
    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial);
    }
}