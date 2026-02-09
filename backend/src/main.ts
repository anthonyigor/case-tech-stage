import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }))

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173'
  })

  // swagger
  const config = new DocumentBuilder()
  .setTitle("StageProcess")
  .setDescription("API para gestão de áreas e árvore de processos (case técnico).")
  .setVersion("1.0.0")
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, document, {
    customSiteTitle: "Case Tech API Docs"
  })

  await app.listen(3000);
}
bootstrap();
