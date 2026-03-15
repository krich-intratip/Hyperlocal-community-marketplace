import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { LangInterceptor } from './common/lang.interceptor'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )

  const configService = app.get(ConfigService)
  const port = configService.get<number>('API_PORT', 4000)
  const appEnv = configService.get<string>('APP_ENV', 'development')
  const isProduction = appEnv === 'production'

  // ── Security: Fastify helmet (HTTP security headers) ──
  await app.register(import('@fastify/helmet'), {
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: [],
          },
        }
      : false,
    hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })

  // ── Cookie parsing: required for httpOnly JWT cookie auth ──
  await app.register(import('@fastify/cookie'))

  // ── Security: CORS — whitelist only ──
  app.enableCors({
    origin: (origin, callback) => {
      const allowed = configService
        .get<string>('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim())
      if (!origin || allowed.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS blocked: ${origin}`), false)
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  })

  app.setGlobalPrefix('api')
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })

  // ── Validation: strip unknown fields, transform types ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: false,
    }),
  )

  // ── Global exception filter: sanitised error responses ──
  app.useGlobalFilters(new HttpExceptionFilter())

  // ── i18n: parse Accept-Language header, attach req.lang ('th' | 'en') ──
  app.useGlobalInterceptors(new LangInterceptor())

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
  logger.log(`🚀 API running on http://localhost:${port}/api/v1`)
  if (!isProduction) {
    logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`)
  }
}

bootstrap()
