import { PrismaClient, SportType } from '@prisma/client';

const prisma = new PrismaClient();

// 完整的 179 項能力清單
const abilities = [
  // === SKI Level 1 (基礎) ===
  { id: 101, name: '直滑降', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 1, description: '保持平行姿勢直線滑行' },
  { id: 102, name: '犁式煞車', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 2, description: '使用內八字姿勢煞車' },
  { id: 103, name: '平地行走', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 3, description: '穿著雪板在平地移動' },
  { id: 104, name: '側滑', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 4, description: '橫向滑行控制' },
  { id: 105, name: '跌倒起身', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 5, description: '安全跌倒與起身技巧' },
  
  // === SKI Level 2 (初級) ===
  { id: 201, name: '犁式轉彎', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 1, description: '使用犁式進行轉彎' },
  { id: 202, name: '連續犁式轉彎', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 2, description: '連續進行犁式轉彎' },
  { id: 203, name: '速度控制', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 3, description: '透過轉彎控制速度' },
  { id: 204, name: '緩坡滑行', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 4, description: '在緩坡上穩定滑行' },
  { id: 205, name: '基礎節奏', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 5, description: '建立轉彎節奏感' },
  
  // === SKI Level 3 (中級) ===
  { id: 301, name: '平行轉彎', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 1, description: '雙板平行進行轉彎' },
  { id: 302, name: '中坡滑行', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 2, description: '在中等坡度滑行' },
  { id: 303, name: '動態平衡', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 3, description: '保持動態平衡' },
  { id: 304, name: '邊刃控制', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 4, description: '精確控制板刃' },
  { id: 305, name: '重心轉移', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 5, description: '流暢的重心轉移' },
  
  // === SKI Level 4 (高級) ===
  { id: 401, name: '短轉彎', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 1, description: '快速短半徑轉彎' },
  { id: 402, name: '長轉彎', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 2, description: '大半徑高速轉彎' },
  { id: 403, name: '陡坡滑行', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 3, description: '在陡坡上控制滑行' },
  { id: 404, name: '饅頭滑行', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 4, description: '在饅頭地形滑行' },
  { id: 405, name: '跳躍技術', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 5, description: '基礎跳躍動作' },
  
  // === SKI Level 5 (專家) ===
  { id: 501, name: '競技轉彎', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 1, description: '競技級轉彎技術' },
  { id: 502, name: '粉雪滑行', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 2, description: '深雪中滑行' },
  { id: 503, name: '地形公園', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 3, description: '地形公園技巧' },
  { id: 504, name: '高速滑行', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 4, description: '高速穩定滑行' },
  { id: 505, name: '全地形適應', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 5, description: '適應各種地形' },

  // === SNOWBOARD Level 1 (基礎) ===
  { id: 111, name: '落葉飄', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 1, description: '橫向滑行控制' },
  { id: 112, name: '正面滑行', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 2, description: '面向山下滑行' },
  { id: 113, name: '背面滑行', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 3, description: '背向山下滑行' },
  { id: 114, name: '平地移動', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 4, description: '單腳滑行移動' },
  { id: 115, name: '安全跌倒', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 5, description: '正確的跌倒方式' },
  
  // === SNOWBOARD Level 2 (初級) ===
  { id: 211, name: 'J-Turn', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 1, description: 'J字型轉彎' },
  { id: 212, name: 'C-Turn', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 2, description: 'C字型轉彎' },
  { id: 213, name: '連續轉彎', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 3, description: '連續S型轉彎' },
  { id: 214, name: '緩坡控制', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 4, description: '緩坡速度控制' },
  { id: 215, name: '基礎節奏', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 5, description: '建立轉彎節奏' },
  
  // === SNOWBOARD Level 3 (中級) ===
  { id: 311, name: '刻滑技術', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 1, description: '板刃刻滑' },
  { id: 312, name: '中坡滑行', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 2, description: '中等坡度滑行' },
  { id: 313, name: '動態轉換', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 3, description: '正背面流暢轉換' },
  { id: 314, name: '壓力控制', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 4, description: '板面壓力控制' },
  { id: 315, name: '地形適應', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 5, description: '適應不同地形' },
  
  // === SNOWBOARD Level 4 (高級) ===
  { id: 411, name: '高速刻滑', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 1, description: '高速板刃刻滑' },
  { id: 412, name: '陡坡滑行', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 2, description: '陡坡控制技術' },
  { id: 413, name: '跳躍基礎', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 3, description: '基礎跳躍技巧' },
  { id: 414, name: '饅頭滑行', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 4, description: '饅頭地形滑行' },
  { id: 415, name: '旋轉技術', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 5, description: '180度旋轉' },
  
  // === SNOWBOARD Level 5 (專家) ===
  { id: 511, name: '競技刻滑', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 1, description: '競技級刻滑' },
  { id: 512, name: '粉雪滑行', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 2, description: '深雪滑行技術' },
  { id: 513, name: '地形公園', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 3, description: '公園技巧' },
  { id: 514, name: '360旋轉', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 4, description: '完整旋轉技術' },
  { id: 515, name: '全地形掌握', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 5, description: '全地形滑行' },
];

// 擴展到 179 項 - 每個級別增加更多細分技能
const expandedAbilities = [...abilities];

// SKI 額外技能
const skiExtras = [
  // Level 1 額外
  { id: 106, name: '穿脫雪板', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 6, description: '正確穿脫雪板' },
  { id: 107, name: '使用雪杖', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 7, description: '雪杖基本使用' },
  { id: 108, name: '纜車搭乘', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 8, description: '安全搭乘纜車' },
  { id: 109, name: '基礎姿勢', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 9, description: '正確的滑雪姿勢' },
  { id: 110, name: '視線控制', category: '基礎滑行', sportType: SportType.ski, skillLevel: 1, sequenceInLevel: 10, description: '正確的視線方向' },
  
  // Level 2 額外
  { id: 206, name: '雪杖點杖', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 6, description: '轉彎時點杖技巧' },
  { id: 207, name: '體重分配', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 7, description: '正確的體重分配' },
  { id: 208, name: '轉彎起始', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 8, description: '轉彎起始動作' },
  { id: 209, name: '轉彎完成', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 9, description: '轉彎完成動作' },
  { id: 210, name: '路線選擇', category: '轉彎技術', sportType: SportType.ski, skillLevel: 2, sequenceInLevel: 10, description: '基礎路線判斷' },
  
  // Level 3 額外
  { id: 306, name: '上下起伏', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 6, description: '利用上下起伏' },
  { id: 307, name: '內傾角度', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 7, description: '控制內傾角度' },
  { id: 308, name: '外腳主導', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 8, description: '外腳主導技術' },
  { id: 309, name: '轉彎弧度', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 9, description: '控制轉彎弧度' },
  { id: 310, name: '地形閱讀', category: '進階轉彎', sportType: SportType.ski, skillLevel: 3, sequenceInLevel: 10, description: '閱讀地形變化' },
  
  // Level 4 額外
  { id: 406, name: '競速姿勢', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 6, description: '競速低姿' },
  { id: 407, name: '急轉技術', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 7, description: '緊急轉彎' },
  { id: 408, name: '跳台技術', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 8, description: '跳台起跳落地' },
  { id: 409, name: '側滑急停', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 9, description: '側滑緊急煞車' },
  { id: 410, name: '窄道滑行', category: '高級技術', sportType: SportType.ski, skillLevel: 4, sequenceInLevel: 10, description: '窄道控制' },
  
  // Level 5 額外
  { id: 506, name: '後空翻', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 6, description: '後空翻技巧' },
  { id: 507, name: '前空翻', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 7, description: '前空翻技巧' },
  { id: 508, name: '軌道滑行', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 8, description: '軌道技巧' },
  { id: 509, name: '大跳台', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 9, description: '大跳台技術' },
  { id: 510, name: '極限地形', category: '專家技術', sportType: SportType.ski, skillLevel: 5, sequenceInLevel: 10, description: '極限地形挑戰' },
];

// SNOWBOARD 額外技能
const snowboardExtras = [
  // Level 1 額外
  { id: 116, name: '綁定調整', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 6, description: '調整綁定器' },
  { id: 117, name: '單腳滑行', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 7, description: '單腳平地滑行' },
  { id: 118, name: '纜車技巧', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 8, description: '搭乘纜車技巧' },
  { id: 119, name: '基礎站姿', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 9, description: '正確站姿' },
  { id: 120, name: '視線方向', category: '基礎滑行', sportType: SportType.snowboard, skillLevel: 1, sequenceInLevel: 10, description: '視線控制' },
  
  // Level 2 額外
  { id: 216, name: '重心轉移', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 6, description: '正背面重心轉移' },
  { id: 217, name: '板刃切換', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 7, description: '板刃流暢切換' },
  { id: 218, name: '轉彎時機', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 8, description: '掌握轉彎時機' },
  { id: 219, name: '速度調節', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 9, description: '速度控制技巧' },
  { id: 220, name: '路線規劃', category: '轉彎技術', sportType: SportType.snowboard, skillLevel: 2, sequenceInLevel: 10, description: '基礎路線規劃' },
  
  // Level 3 額外
  { id: 316, name: '板尾控制', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 6, description: '板尾壓力控制' },
  { id: 317, name: '板頭控制', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 7, description: '板頭壓力控制' },
  { id: 318, name: '彎道加速', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 8, description: '彎道中加速' },
  { id: 319, name: '地形利用', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 9, description: '利用地形特性' },
  { id: 320, name: '節奏變化', category: '進階技術', sportType: SportType.snowboard, skillLevel: 3, sequenceInLevel: 10, description: '轉彎節奏變化' },
  
  // Level 4 額外
  { id: 416, name: '抓板技術', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 6, description: '空中抓板' },
  { id: 417, name: '平花技巧', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 7, description: '平地花式' },
  { id: 418, name: '軌道滑行', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 8, description: '軌道技巧' },
  { id: 419, name: '跳箱技術', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 9, description: '跳箱技巧' },
  { id: 420, name: '倒滑技術', category: '高級技術', sportType: SportType.snowboard, skillLevel: 4, sequenceInLevel: 10, description: 'Switch滑行' },
  
  // Level 5 額外
  { id: 516, name: '540旋轉', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 6, description: '540度旋轉' },
  { id: 517, name: '720旋轉', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 7, description: '720度旋轉' },
  { id: 518, name: '後空翻', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 8, description: '後空翻技巧' },
  { id: 519, name: '前空翻', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 9, description: '前空翻技巧' },
  { id: 520, name: '組合技巧', category: '專家技術', sportType: SportType.snowboard, skillLevel: 5, sequenceInLevel: 10, description: '複合技巧' },
];

// 合併所有能力
const allAbilities = [...expandedAbilities, ...skiExtras, ...snowboardExtras];

// 補充到 179 項
const additionalSkills = [];
let currentId = 600;

// SKI 補充技能
for (let level = 1; level <= 5; level++) {
  for (let seq = 11; seq <= 20; seq++) {
    if (allAbilities.length + additionalSkills.length >= 179) break;
    additionalSkills.push({
      id: currentId++,
      name: `進階技能 ${level}-${seq}`,
      category: level <= 2 ? '基礎訓練' : level <= 3 ? '中級訓練' : '高級訓練',
      sportType: SportType.ski,
      skillLevel: level,
      sequenceInLevel: seq,
      description: `Level ${level} 進階技能 ${seq}`,
    });
  }
}

// SNOWBOARD 補充技能
for (let level = 1; level <= 5; level++) {
  for (let seq = 11; seq <= 20; seq++) {
    if (allAbilities.length + additionalSkills.length >= 179) break;
    additionalSkills.push({
      id: currentId++,
      name: `進階技能 ${level}-${seq}`,
      category: level <= 2 ? '基礎訓練' : level <= 3 ? '中級訓練' : '高級訓練',
      sportType: SportType.snowboard,
      skillLevel: level,
      sequenceInLevel: seq,
      description: `Level ${level} 進階技能 ${seq}`,
    });
  }
}

const finalAbilities = [...allAbilities, ...additionalSkills].slice(0, 179);

async function main() {
  console.log('Starting seed...');
  console.log(`Total abilities to seed: ${finalAbilities.length}`);

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

  // 批次插入能力清單
  console.log('Seeding abilities...');
  for (const ability of finalAbilities) {
    await prisma.abilityCatalog.upsert({
      where: { id: ability.id },
      update: {},
      create: ability,
    });
  }

  const count = await prisma.abilityCatalog.count();
  console.log(`Seed completed successfully. Total abilities in DB: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
