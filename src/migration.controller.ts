import { Controller, Post, Get } from '@nestjs/common';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

@Controller('migration')
export class MigrationController {
    @Get('status')
    async getStatus() {
        const directUrl = process.env.DIRECT_URL;
        if (!directUrl) {
            return { status: 'error', message: 'DIRECT_URL not configured' };
        }

        const client = new Client({ connectionString: directUrl });

        try {
            await client.connect();
            await client.query('SELECT 1 FROM "Resort" LIMIT 1');
            await client.end();
            return { status: 'completed', message: 'Database tables exist' };
        } catch (error) {
            await client.end();
            return { status: 'pending', message: 'Tables not found', error: error.message };
        }
    }

    @Post('run')
    async runMigration() {
        const directUrl = process.env.DIRECT_URL;
        if (!directUrl) {
            return { status: 'error', message: 'DIRECT_URL not configured' };
        }

        const client = new Client({ connectionString: directUrl });

        try {
            await client.connect();
            
            // 讀取 migration SQL
            const sqlPath = path.join(process.cwd(), 'prisma', 'migrations', '20251122_init', 'migration.sql');
            const sql = fs.readFileSync(sqlPath, 'utf8');
            
            // 執行 SQL
            await client.query(sql);
            
            await client.end();

            return { 
                status: 'success', 
                message: 'Migration completed successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            try {
                await client.end();
            } catch {}
            
            return { 
                status: 'error', 
                message: error.message,
                code: error.code,
                timestamp: new Date().toISOString()
            };
        }
    }
}
