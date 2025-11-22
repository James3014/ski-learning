import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Endpoints Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return welcome message', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World from NestJS!');
    });

    it('should have CORS headers', () => {
      return request(app.getHttpServer())
        .get('/')
        .set('Origin', 'http://example.com')
        .expect(200)
        .expect('Access-Control-Allow-Origin', '*');
    });
  });

  describe('GET /health', () => {
    it('should return health status with required fields', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('db');
          expect(res.body).toHaveProperty('timestamp');
          expect(['ok', 'error']).toContain(res.body.status);
          expect(['connected', 'disconnected']).toContain(res.body.db);
        });
    });

    it('should handle database connection failure gracefully', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          // Without DATABASE_URL or with invalid one, should return error status
          // but application should not crash
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('db');
          expect(res.body).toHaveProperty('timestamp');
          
          // If db is disconnected, should have error field
          if (res.body.db === 'disconnected') {
            expect(res.body).toHaveProperty('error');
            expect(res.body.status).toBe('error');
          }
        });
    });
  });

  describe('GET /invalid-path', () => {
    it('should return 404 for invalid paths', () => {
      return request(app.getHttpServer())
        .get('/invalid-path')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
        });
    });
  });

  describe('Response Time', () => {
    it('should respond within 2 seconds for root path', async () => {
      const startTime = Date.now();
      await request(app.getHttpServer()).get('/').expect(200);
      const endTime = Date.now();
      const responseTime = (endTime - startTime) / 1000;
      expect(responseTime).toBeLessThan(2);
    });

    it('should respond within 2 seconds for health check', async () => {
      const startTime = Date.now();
      await request(app.getHttpServer()).get('/health').expect(200);
      const endTime = Date.now();
      const responseTime = (endTime - startTime) / 1000;
      expect(responseTime).toBeLessThan(2);
    });
  });
});
