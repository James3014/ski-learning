import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
    constructor(private prisma: PrismaService) {}

    @Get()
    getHello(): string {
        return 'Ski Teaching Assessment API';
    }

    @Get('health')
    async getHealth() {
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
                timestamp: new Date().toISOString()
            };
        }
    }
}
