

export class WalletDto {
    email: string;
    nick: string;
    cyberDollor: number;
    updatedAt: Date;
    
    constructor(partial: Partial<WalletDto>) {
        Object.assign(this, partial);
    }
}