"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
describe('API Endpoints Integration Tests', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
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
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/')
                .expect(200)
                .expect('Hello World from NestJS!');
        });
        it('should have CORS headers', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/')
                .set('Origin', 'http://example.com')
                .expect(200)
                .expect('Access-Control-Allow-Origin', '*');
        });
    });
    describe('GET /health', () => {
        it('should return health status with required fields', () => {
            return (0, supertest_1.default)(app.getHttpServer())
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
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/health')
                .expect(200)
                .expect((res) => {
                expect(res.body).toHaveProperty('status');
                expect(res.body).toHaveProperty('db');
                expect(res.body).toHaveProperty('timestamp');
                if (res.body.db === 'disconnected') {
                    expect(res.body).toHaveProperty('error');
                    expect(res.body.status).toBe('error');
                }
            });
        });
    });
    describe('GET /invalid-path', () => {
        it('should return 404 for invalid paths', () => {
            return (0, supertest_1.default)(app.getHttpServer())
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
            await (0, supertest_1.default)(app.getHttpServer()).get('/').expect(200);
            const endTime = Date.now();
            const responseTime = (endTime - startTime) / 1000;
            expect(responseTime).toBeLessThan(2);
        });
        it('should respond within 2 seconds for health check', async () => {
            const startTime = Date.now();
            await (0, supertest_1.default)(app.getHttpServer()).get('/health').expect(200);
            const endTime = Date.now();
            const responseTime = (endTime - startTime) / 1000;
            expect(responseTime).toBeLessThan(2);
        });
    });
});
//# sourceMappingURL=api-endpoints.spec.js.map