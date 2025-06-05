

export class SimpleWalletDto {
    cyberDollor: number;
    updatedAt: Date;
    
    constructor(partial: Partial<SimpleWalletDto>) {
        Object.assign(this, partial);
    }
}