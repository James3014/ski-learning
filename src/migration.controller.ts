import { Controller, Post, Get } from '@nestjs/common';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from './prisma.service';

@Controller('migration')
export class MigrationController {
    constructor(private prisma: PrismaService) {}

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

    @Post('seed')
    async runSeed() {
        try {
            // 建立雪場
            const resort = await this.prisma.resort.upsert({
                where: { id: 1 },
                update: {},
                create: { id: 1, name: '苗場滑雪場', location: '日本新潟縣' },
            });

            // 建立教練
            const instructor = await this.prisma.instructor.upsert({
                where: { id: 'instructor-1' },
                update: {},
                create: { id: 'instructor-1', accountId: 'account-1', canViewSharedRecords: true },
            });

            // 建立課程
            const lesson = await this.prisma.lesson.upsert({
                where: { id: 1 },
                update: {},
                create: { id: 1, resortId: resort.id, instructorId: instructor.id, date: new Date('2025-12-01') },
            });

            // 建立席位
            for (let i = 1; i <= 3; i++) {
                const seat = await this.prisma.orderSeat.upsert({
                    where: { id: `seat-${i}` },
                    update: {},
                    create: { id: `seat-${i}`, lessonId: lesson.id, seatNumber: i, status: 'invited' },
                });

                await this.prisma.seatInvitation.upsert({
                    where: { code: `INVITE${i}00` },
                    update: {},
                    create: { code: `INVITE${i}00`, seatId: seat.id, expiresAt: new Date('2025-12-31') },
                });
            }

            // 建立能力清單
            const abilities = [
                { name: '直滑降', category: '基礎', sportType: 'SKI', skillLevel: 1, sequenceInLevel: 1, description: '保持平行姿勢直線滑行' },
                { name: '犁式煞車', category: '基礎', sportType: 'SKI', skillLevel: 1, sequenceInLevel: 2, description: '使用內八字姿勢煞車' },
                { name: '犁式轉彎', category: '轉彎', sportType: 'SKI', skillLevel: 2, sequenceInLevel: 1, description: '使用犁式進行轉彎' },
                { name: '平行轉彎', category: '轉彎', sportType: 'SKI', skillLevel: 3, sequenceInLevel: 1, description: '雙板平行進行轉彎' },
                { name: '落葉飄', category: '基礎', sportType: 'SNOWBOARD', skillLevel: 1, sequenceInLevel: 1, description: '橫向滑行控制' },
                { name: 'J-Turn', category: '轉彎', sportType: 'SNOWBOARD', skillLevel: 2, sequenceInLevel: 1, description: 'J字型轉彎' },
            ];

            for (const ability of abilities) {
                await this.prisma.abilityCatalog.upsert({
                    where: { id: ability.sequenceInLevel + (ability.skillLevel * 100) },
                    update: {},
                    create: ability,
                });
            }

            return { 
                status: 'success', 
                message: 'Seed data created successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return { 
                status: 'error', 
                message: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}
