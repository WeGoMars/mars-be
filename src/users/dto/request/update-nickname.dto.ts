import { IsString, Length } from 'class-validator';

export class UpdateNicknameDto {
  @IsString()
  @Length(2, 20) // 닉네임은 2~20자 사이 추천
  nick: string;
}