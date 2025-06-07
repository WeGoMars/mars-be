

export class WalletDto {
    email: string;
    nick: string;
    cyberDollar: number;
    updatedAt: Date;
    
    constructor(partial: Partial<WalletDto>) {
        Object.assign(this, partial);
    }
}