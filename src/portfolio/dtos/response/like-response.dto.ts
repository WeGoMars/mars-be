export class LikeResponse{
    symbol:string;
    createdAt:Date;

    constructor(partial:Partial<LikeResponse>){
        Object.assign(this,partial);
    }
}