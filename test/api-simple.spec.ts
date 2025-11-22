import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Simple Tests', () => {
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

  it('GET / should return welcome message', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World from NestJS!');
  });

  it('GET /health should return JSON with status field', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('db');
        expect(response.body).toHaveProperty('timestamp');
      });
  });

  it('GET /invalid should return 404', () => {
    return request(app.getHttpServer())
      .get('/invalid')
      .expect(404);
  });
});
