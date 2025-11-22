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
            await this.prisma.$disconnect();
            return { 
                status: 'ok', 
                db: 'connected',
                timestamp: new Date().toISOString(),
                env: process.env.NODE_ENV || 'development'
            };
        } catch (error) {
            return { 
                status: 'error', 
                db: 'disconnected', 
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}
