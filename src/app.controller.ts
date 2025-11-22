import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getHello(): string {
        return 'Hello World from NestJS!';
    }

    @Get('health')
    getHealth(): any {
        return { 
            status: 'ok', 
            db: 'not_configured',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || 'development'
        };
    }
}
