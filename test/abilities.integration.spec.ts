import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Abilities Integration Tests', () => {
  let app: INestApplication;

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
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /abilities', () => {
    it('should return all abilities', () => {
      return request(app.getHttpServer())
        .get('/abilities')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.total).toBeGreaterThan(0);
        });
    });

    it('should filter by sportType', () => {
      return request(app.getHttpServer())
        .get('/abilities?sportType=ski')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.every((a) => a.sportType === 'ski')).toBe(true);
        });
    });

    it('should filter by skillLevel', () => {
      return request(app.getHttpServer())
        .get('/abilities?skillLevel=1')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.every((a) => a.skillLevel === 1)).toBe(true);
        });
    });

    it('should filter by both sportType and skillLevel', () => {
      return request(app.getHttpServer())
        .get('/abilities?sportType=snowboard&skillLevel=2')
        .expect(200)
        .expect((res) => {
          expect(
            res.body.data.every(
              (a) => a.sportType === 'snowboard' && a.skillLevel === 2,
            ),
          ).toBe(true);
        });
    });

    it('should reject invalid sportType', () => {
      return request(app.getHttpServer())
        .get('/abilities?sportType=invalid')
        .expect(400);
    });

    it('should reject invalid skillLevel', () => {
      return request(app.getHttpServer())
        .get('/abilities?skillLevel=abc')
        .expect(400);
    });

    it('should order by skillLevel and sequenceInLevel', () => {
      return request(app.getHttpServer())
        .get('/abilities?sportType=ski')
        .expect(200)
        .expect((res) => {
          const data = res.body.data;
          for (let i = 1; i < data.length; i++) {
            const prev = data[i - 1];
            const curr = data[i];
            
            if (prev.skillLevel === curr.skillLevel) {
              expect(prev.sequenceInLevel).toBeLessThanOrEqual(
                curr.sequenceInLevel,
              );
            } else {
              expect(prev.skillLevel).toBeLessThan(curr.skillLevel);
            }
          }
        });
    });
  });
});
