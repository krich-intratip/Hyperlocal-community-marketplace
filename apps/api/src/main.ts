import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )

  const configService = app.get(ConfigService)
  const port = configService.get<number>('API_PORT', 4000)
  const appEnv = configService.get<string>('APP_ENV', 'development')

  app.enableCors({
    origin: configService.get<string>('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(','),
    credentials: true,
  })

  app.setGlobalPrefix('api')
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  if (appEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Community Hyper Marketplace API')
      .setDescription('API documentation for Community Hyper Marketplace platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
  }

  await app.listen(port, '0.0.0.0')
  console.log(`🚀 API running on http://localhost:${port}/api/v1`)
  if (appEnv !== 'production') {
    console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`)
  }
}

bootstrap()
