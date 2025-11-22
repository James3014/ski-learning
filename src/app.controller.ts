import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
    constructor(private prisma: PrismaService) {}

    @Get()
    getHello(): string {
        return 'Hello World from NestJS!';
    }

    @Get('health')
    async getHealth(): Promise<any> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
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
