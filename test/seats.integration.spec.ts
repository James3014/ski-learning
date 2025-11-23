import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('Seats Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /seats/:code', () => {
    it('should return seat information for valid code', () => {
      return request(app.getHttpServer())
        .get('/seats/INVITE100')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('code');
          expect(res.body).toHaveProperty('seat');
          expect(res.body).toHaveProperty('lesson');
        });
    });

    it('should return 404 for invalid code', () => {
      return request(app.getHttpServer())
        .get('/seats/INVALID')
        .expect(404);
    });
  });

  describe('POST /seats/claim', () => {
    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/seats/claim')
        .send({})
        .expect(400);
    });

    it('should validate email format', () => {
      return request(app.getHttpServer())
        .post('/seats/claim')
        .send({
          code: 'INVITE100',
          studentEmail: 'invalid-email',
        })
        .expect(400);
    });

    it('should use resortId from lesson relationship', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      const testCode = 'INVITE200';

      const response = await request(app.getHttpServer())
        .post('/seats/claim')
        .send({
          code: testCode,
          studentEmail: testEmail,
        })
        .expect(200);

      expect(response.body).toHaveProperty('seatId');
      expect(response.body).toHaveProperty('studentId');

      // Verify resortId is from lesson, not hardcoded
      const student = await prisma.globalStudent.findFirst({
        where: { email: testEmail },
      });

      const mapping = await prisma.studentMapping.findFirst({
        where: { globalStudentId: student.id },
      });

      const seat = await prisma.orderSeat.findUnique({
        where: { id: response.body.seatId },
        include: { lesson: true },
      });

      expect(mapping.resortId).toBe(seat.lesson.resortId);
    });
  });

  describe('POST /seats/:id/identity', () => {
    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/seats/seat-1/identity')
        .send({})
        .expect(400);
    });

    it('should validate email format', () => {
      return request(app.getHttpServer())
        .post('/seats/seat-1/identity')
        .send({
          studentDisplayName: 'Test Student',
          birthDate: '2000-01-01',
          contactEmail: 'invalid',
          contactPhone: '0912345678',
          isMinor: false,
          hasExternalInsurance: false,
        })
        .expect(400);
    });
  });
});
