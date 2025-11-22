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
    getHealth(): any {
        return { 
            status: 'ok', 
            db: 'migration_pending',
            message: 'Use POST /migration/run to initialize database',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || 'development'
        };
    }

    @Get('test-db')
    async testDb() {
        try {
            const result = await this.prisma.$queryRaw`SELECT 1 as test`;
            return { status: 'success', result };
        } catch (error) {
            return { status: 'error', message: error.message, stack: error.stack };
        }
    }
}
