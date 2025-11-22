import { Controller, Post, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('migration')
export class MigrationController {
    constructor(private prisma: PrismaService) {}

    @Get('status')
    async getStatus() {
        try {
            // 檢查 Resort table 是否存在
            await this.prisma.$queryRaw`SELECT 1 FROM "Resort" LIMIT 1`;
            return { status: 'completed', message: 'Database tables exist' };
        } catch (error) {
            return { status: 'pending', message: 'Tables not found', error: error.message };
        }
    }

    @Post('run')
    async runMigration() {
        try {
            // 執行 migration SQL
            await this.prisma.$executeRawUnsafe(`
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('pending', 'invited', 'claimed', 'completed', 'expired');
CREATE TYPE "SeatIdentityStatus" AS ENUM ('draft', 'submitted', 'confirmed');
CREATE TYPE "SportType" AS ENUM ('snowboard', 'ski');

-- CreateTable
CREATE TABLE "Resort" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    CONSTRAINT "Resort_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "can_view_shared_records" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "resort_id" INTEGER NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_seats" (
    "id" TEXT NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "claimed_mapping_id" TEXT,
    "status" "SeatStatus" NOT NULL DEFAULT 'pending',
    "claimed_at" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_seats_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "seat_invitations" (
    "code" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "claimed_at" TIMESTAMPTZ,
    "claimed_by" TEXT,
    CONSTRAINT "seat_invitations_pkey" PRIMARY KEY ("code")
);

CREATE TABLE "global_students" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "global_students_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "student_mappings" (
    "id" TEXT NOT NULL,
    "global_student_id" TEXT NOT NULL,
    "resort_id" INTEGER NOT NULL,
    CONSTRAINT "student_mappings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "guardian_relationships" (
    "id" TEXT NOT NULL,
    "guardian_email" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "guardian_relationships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "seat_identity_forms" (
    "id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "status" "SeatIdentityStatus" NOT NULL DEFAULT 'draft',
    "student_display_name" TEXT NOT NULL,
    "student_english_name" TEXT,
    "birth_date" DATE NOT NULL,
    "contact_email" TEXT NOT NULL,
    "guardian_email" TEXT,
    "contact_phone" TEXT NOT NULL,
    "is_minor" BOOLEAN NOT NULL,
    "has_external_insurance" BOOLEAN NOT NULL,
    "insurance_provider" TEXT,
    "note" TEXT,
    "submitted_at" TIMESTAMPTZ,
    "confirmed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "seat_identity_forms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ability_catalog" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sport_type" "SportType" NOT NULL,
    "skill_level" INTEGER NOT NULL,
    "sequence_in_level" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "ability_catalog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "seat_invitations_seat_id_key" ON "seat_invitations"("seat_id");
CREATE UNIQUE INDEX "seat_identity_forms_seat_id_key" ON "seat_identity_forms"("seat_id");

ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_resort_id_fkey" FOREIGN KEY ("resort_id") REFERENCES "Resort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "order_seats" ADD CONSTRAINT "order_seats_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "order_seats" ADD CONSTRAINT "order_seats_claimed_mapping_id_fkey" FOREIGN KEY ("claimed_mapping_id") REFERENCES "student_mappings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "seat_invitations" ADD CONSTRAINT "seat_invitations_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "order_seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "student_mappings" ADD CONSTRAINT "student_mappings_global_student_id_fkey" FOREIGN KEY ("global_student_id") REFERENCES "global_students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "student_mappings" ADD CONSTRAINT "student_mappings_resort_id_fkey" FOREIGN KEY ("resort_id") REFERENCES "Resort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "guardian_relationships" ADD CONSTRAINT "guardian_relationships_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "global_students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "seat_identity_forms" ADD CONSTRAINT "seat_identity_forms_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "order_seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
            `);

            return { 
                status: 'success', 
                message: 'Migration completed successfully',
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
