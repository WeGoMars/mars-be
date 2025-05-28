// src/common/helpers/getUserOrThrow.ts
import { UnauthorizedException } from '@nestjs/common';

export function getUserOrThrow(session: any) {
  if (!session?.user) {
    throw new UnauthorizedException('로그인이 필요합니다');
  }

  return session.user as { id: number; email: string; nick: string };
}
