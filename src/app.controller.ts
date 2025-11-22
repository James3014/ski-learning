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
            // 只測試連線，不執行查詢（避免 table 不存在的錯誤）
            await this.prisma.$connect();
            return { 
                status: 'ok', 
                db: 'connected',
                message: 'Database migration pending',
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
