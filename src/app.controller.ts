import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller()
export class AppController {
    private prisma = new PrismaClient();

    @Get()
    getHello(): string {
        return 'Hello World from NestJS!';
    }

    @Get('health')
    async getHealth(): Promise<any> {
        try {
            await this.prisma.$connect();
            return { status: 'ok', db: 'connected' };
        } catch (error) {
            return { status: 'error', db: 'disconnected', error: error.message };
        }
    }
}
