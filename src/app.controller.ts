import { Controller, Get, Post } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Resort } from './database/entities/resort.entity';
import { Instructor } from './database/entities/instructor.entity';
import { Lesson } from './database/entities/lesson.entity';
import { OrderSeat } from './database/entities/order-seat.entity';
import { SeatInvitation } from './database/entities/seat-invitation.entity';
import { AbilityCatalog, SportType } from './database/entities/ability-catalog.entity';

@Controller()
export class AppController {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
    ) {}

    @Get()
    getWelcome() {
        return {
            message: 'Ski Teaching Assessment System API',
            version: '0.3.0',
            endpoints: {
                health: 'GET /health',
                abilities: 'GET /abilities',
                seats: 'GET /seats/:code',
                claimSeat: 'POST /seats/claim',
                submitIdentity: 'POST /seats/:id/identity',
                seed: 'POST /seed',
            },
        };
    }

    @Get('health')
    async getHealth() {
        try {
            await this.dataSource.query('SELECT 1');
            return { 
                status: 'ok', 
                database: 'connected',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            return { 
                status: 'error', 
                database: 'disconnected',
                error: error.message,
            };
        }
    }

    @Post('seed')
    async seedDatabase() {
        try {
            const resortRepo = this.dataSource.getRepository(Resort);
            const instructorRepo = this.dataSource.getRepository(Instructor);
            const lessonRepo = this.dataSource.getRepository(Lesson);
            const seatRepo = this.dataSource.getRepository(OrderSeat);
            const invitationRepo = this.dataSource.getRepository(SeatInvitation);
            const abilityRepo = this.dataSource.getRepository(AbilityCatalog);

            // Create resort
            let resort = await resortRepo.findOne({ where: { id: 1 } });
            if (!resort) {
                resort = await resortRepo.save(resortRepo.create({
                    id: 1,
                    name: 'Demo Resort',
                    location: 'Taiwan',
                }));
            }

            // Create instructor
            let instructor = await instructorRepo.findOne({ where: { id: 'instructor-1' } });
            if (!instructor) {
                instructor = await instructorRepo.save(instructorRepo.create({
                    id: 'instructor-1',
                    accountId: 'account-1',
                    canViewSharedRecords: false,
                }));
            }

            // Create lesson
            let lesson = await lessonRepo.findOne({ where: { id: 1 } });
            if (!lesson) {
                lesson = await lessonRepo.save(lessonRepo.create({
                    id: 1,
                    resortId: resort.id,
                    instructorId: instructor.id,
                    date: new Date('2025-01-15'),
                }));
            }

            // Create seats
            for (let i = 1; i <= 3; i++) {
                const seatId = `seat-${i}`;
                let seat = await seatRepo.findOne({ where: { id: seatId } });
                if (!seat) {
                    seat = await seatRepo.save(seatRepo.create({
                        id: seatId,
                        lessonId: lesson.id,
                        seatNumber: i,
                        status: 'invited' as any,
                    }));
                }

                const code = `INVITE${i}00`;
                const existingInvitation = await invitationRepo.findOne({ where: { code } });
                if (!existingInvitation) {
                    await invitationRepo.save(invitationRepo.create({
                        code,
                        seatId: seat.id,
                        expiresAt: new Date('2025-01-10'),
                    }));
                }
            }

            // Seed abilities (simplified - just a few examples)
            const abilities = [
                { id: 1, name: '直滑降', category: '基礎滑行', sportType: SportType.SKI, skillLevel: 1, sequenceInLevel: 1 },
                { id: 2, name: '煞車', category: '基礎滑行', sportType: SportType.SKI, skillLevel: 1, sequenceInLevel: 2 },
                { id: 3, name: '轉彎', category: '轉彎技術', sportType: SportType.SKI, skillLevel: 2, sequenceInLevel: 1 },
            ];

            for (const ability of abilities) {
                const existing = await abilityRepo.findOne({ where: { id: ability.id } });
                if (!existing) {
                    await abilityRepo.save(abilityRepo.create(ability));
                }
            }

            const count = await abilityRepo.count();

            return {
                success: true,
                message: 'Database seeded successfully',
                counts: {
                    resorts: 1,
                    instructors: 1,
                    lessons: 1,
                    seats: 3,
                    invitations: 3,
                    abilities: count,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
