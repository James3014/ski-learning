"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
describe('API Simple Tests', () => {
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
    it('GET / should return welcome message', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World from NestJS!');
    });
    it('GET /health should return JSON with status field', () => {
        return (0, supertest_1.default)(app.getHttpServer())
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
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/invalid')
            .expect(404);
    });
});
//# sourceMappingURL=api-simple.spec.js.map