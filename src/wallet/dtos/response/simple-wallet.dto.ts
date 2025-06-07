export class SimpleWalletDto {
  cyberDollar: number;
  updatedAt: Date;

  constructor(partial: Partial<SimpleWalletDto>) {
    Object.assign(this, partial);
  }
}
