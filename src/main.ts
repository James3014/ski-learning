import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    
    // Zeabur 使用動態 PORT 環境變數
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    
    console.log(`Application is running on port ${port}`);
}
bootstrap();
