import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  // 移除自動連接，避免啟動時的 OpenSSL 錯誤
  // 只在實際使用時才連接（透過 Prisma Accelerate）
}
