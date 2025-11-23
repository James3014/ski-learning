import { Controller, Get, Post } from '@nestjs/common';
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

    @Post('seed')
    async runSeed() {
        try {
            // Import seed function
            const { PrismaClient, SportType } = await import('@prisma/client');
            const seedPrisma = new PrismaClient();

            // Create resort
            const resort = await seedPrisma.resort.upsert({
                where: { id: 1 },
                update: {},
                create: { id: 1, name: '苗場滑雪場', location: '日本新潟縣' },
            });

            // Create instructor
            const instructor = await seedPrisma.instructor.upsert({
                where: { id: 'instructor-1' },
                update: {},
                create: { id: 'instructor-1', accountId: 'account-1', canViewSharedRecords: true },
            });

            // Create lesson
            const lesson = await seedPrisma.lesson.upsert({
                where: { id: 1 },
                update: {},
                create: { id: 1, resortId: resort.id, instructorId: instructor.id, date: new Date('2025-12-01') },
            });

            // Create seats
            for (let i = 1; i <= 3; i++) {
                const seat = await seedPrisma.orderSeat.upsert({
                    where: { id: `seat-${i}` },
                    update: {},
                    create: { id: `seat-${i}`, lessonId: lesson.id, seatNumber: i, status: 'invited' },
                });

                await seedPrisma.seatInvitation.upsert({
                    where: { code: `INVITE${i}00` },
                    update: {},
                    create: { code: `INVITE${i}00`, seatId: seat.id, expiresAt: new Date('2025-12-31') },
                });
            }

            // Create abilities (simplified - just a few for testing)
            const abilities = [
                { id: 101, name: '直滑降', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 1, description: '保持平行姿勢直線滑行' },
                { id: 102, name: '犁式煞車', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 2, description: '使用內八字姿勢煞車' },
                { id: 201, name: '犁式轉彎', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 1, description: '使用犁式進行轉彎' },
                { id: 301, name: '平行轉彎', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 1, description: '雙板平行進行轉彎' },
                { id: 111, name: '落葉飄', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 1, description: '橫向滑行控制' },
                { id: 211, name: 'J-Turn', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 1, description: 'J字型轉彎' },
            ];

            for (const ability of abilities) {
                await seedPrisma.abilityCatalog.upsert({
                    where: { id: ability.id },
                    update: {},
                    create: ability,
                });
            }

            const count = await seedPrisma.abilityCatalog.count();
            await seedPrisma.$disconnect();

            return {
                status: 'success',
                message: 'Seed data created',
                data: {
                    resort: 1,
                    instructor: 1,
                    lesson: 1,
                    seats: 3,
                    abilities: count,
                },
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
}
