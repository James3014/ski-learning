import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DIRECT_URL || process.env.DATABASE_URL,
        },
      },
      __internal: {
        engine: {
          binaryTarget: 'linux-musl-openssl-3.0.x',
        },
      },
    } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
