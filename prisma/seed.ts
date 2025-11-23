import { PrismaClient, SportType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const resort = await prisma.resort.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: '苗場滑雪場', location: '日本新潟縣' },
  });

  const instructor = await prisma.instructor.upsert({
    where: { id: 'instructor-1' },
    update: {},
    create: { id: 'instructor-1', accountId: 'account-1', canViewSharedRecords: true },
  });

  const lesson = await prisma.lesson.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, resortId: resort.id, instructorId: instructor.id, date: new Date('2025-12-01') },
  });

  for (let i = 1; i <= 3; i++) {
    const seat = await prisma.orderSeat.upsert({
      where: { id: `seat-${i}` },
      update: {},
      create: { id: `seat-${i}`, lessonId: lesson.id, seatNumber: i, status: 'invited' },
    });

    await prisma.seatInvitation.upsert({
      where: { code: `INVITE${i}00` },
      update: {},
      create: { code: `INVITE${i}00`, seatId: seat.id, expiresAt: new Date('2025-12-31') },
    });
  }

  const abilities = [
    { id: 101, name: '直滑降', category: '基礎', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 1, description: '保持平行姿勢直線滑行' },
    { id: 102, name: '犁式煞車', category: '基礎', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 2, description: '使用內八字姿勢煞車' },
    { id: 201, name: '犁式轉彎', category: '轉彎', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 1, description: '使用犁式進行轉彎' },
    { id: 301, name: '平行轉彎', category: '轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 1, description: '雙板平行進行轉彎' },
    { id: 111, name: '落葉飄', category: '基礎', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 1, description: '橫向滑行控制' },
    { id: 211, name: 'J-Turn', category: '轉彎', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 1, description: 'J字型轉彎' },
  ];

  for (const ability of abilities) {
    await prisma.abilityCatalog.upsert({
      where: { id: ability.id },
      update: {},
      create: ability,
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
