import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('開始 seeding...');

  // 建立雪場
  const resort = await prisma.resort.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '苗場滑雪場',
      location: '日本新潟縣',
    },
  });
  console.log('✓ 雪場建立完成');

  // 建立教練
  const instructor = await prisma.instructor.upsert({
    where: { id: 'instructor-1' },
    update: {},
    create: {
      id: 'instructor-1',
      accountId: 'account-1',
      canViewSharedRecords: true,
    },
  });
  console.log('✓ 教練建立完成');

  // 建立課程
  const lesson = await prisma.lesson.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      resortId: resort.id,
      instructorId: instructor.id,
      date: new Date('2025-12-01'),
    },
  });
  console.log('✓ 課程建立完成');

  // 建立席位和邀請碼
  for (let i = 1; i <= 3; i++) {
    const seat = await prisma.orderSeat.upsert({
      where: { id: `seat-${i}` },
      update: {},
      create: {
        id: `seat-${i}`,
        lessonId: lesson.id,
        seatNumber: i,
        status: 'invited',
      },
    });

    await prisma.seatInvitation.upsert({
      where: { code: `INVITE${i}00` },
      update: {},
      create: {
        code: `INVITE${i}00`,
        seatId: seat.id,
        expiresAt: new Date('2025-12-31'),
      },
    });
  }
  console.log('✓ 席位和邀請碼建立完成');

  // 建立能力清單（簡化版，只建立部分示例）
  const abilities = [
    { name: '直滑降', category: '基礎', sportType: 'ski', skillLevel: 1, sequenceInLevel: 1, description: '保持平行姿勢直線滑行' },
    { name: '犁式煞車', category: '基礎', sportType: 'ski', skillLevel: 1, sequenceInLevel: 2, description: '使用內八字姿勢煞車' },
    { name: '犁式轉彎', category: '轉彎', sportType: 'ski', skillLevel: 2, sequenceInLevel: 1, description: '使用犁式進行轉彎' },
    { name: '平行轉彎', category: '轉彎', sportType: 'ski', skillLevel: 3, sequenceInLevel: 1, description: '雙板平行進行轉彎' },
    { name: '落葉飄', category: '基礎', sportType: 'snowboard', skillLevel: 1, sequenceInLevel: 1, description: '橫向滑行控制' },
    { name: 'J-Turn', category: '轉彎', sportType: 'snowboard', skillLevel: 2, sequenceInLevel: 1, description: 'J字型轉彎' },
  ];

  for (const ability of abilities) {
    await prisma.abilityCatalog.create({
      data: ability,
    });
  }
  console.log('✓ 能力清單建立完成');

  console.log('Seeding 完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
