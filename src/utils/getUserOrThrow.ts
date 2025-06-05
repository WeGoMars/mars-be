// src/common/helpers/getUserOrThrow.ts
import { UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/users/dtos/response/user.dto';

function isUserDto(user: any): boolean {
  return typeof user?.id === 'number' && typeof user?.email === 'string';
}

export function getUserOrThrow(session: any): UserDto {
  if (!session?.user || !isUserDto(session.user)) {
    throw new UnauthorizedException('로그인이 필요합니다');
  }
  return new UserDto(session.user);
}
