import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { CommunitiesModule } from './modules/communities/communities.module'
import { ProvidersModule } from './modules/providers/providers.module'
import { ListingsModule } from './modules/listings/listings.module'
import { BookingsModule } from './modules/bookings/bookings.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { AdminModule } from './modules/admin/admin.module'
import { HealthModule } from './modules/health/health.module'
import { BusinessTemplatesModule } from './modules/business-templates/business-templates.module'
import { PlatformModulesModule } from './modules/platform-modules/platform-modules.module'
import { MarketModulesModule } from './modules/market-modules/market-modules.module'
import { StoreMarketsModule } from './modules/store-markets/store-markets.module'
import { StoreModulesModule } from './modules/store-modules/store-modules.module'
import { OrdersModule } from './modules/orders/orders.module'
import { SystemModule } from './modules/system/system.module'
import { ReturnsModule } from './modules/returns/returns.module'
import { RecommendationsModule } from './modules/recommendations/recommendations.module'
import { MessagesModule } from './modules/messages/messages.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appEnv = configService.get<string>('APP_ENV', 'development')

        if (appEnv !== 'production') {
          return {
            type: 'better-sqlite3',
            database: configService.get<string>('SQLITE_PATH', './dev.db'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true,
          }
        }

        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
          synchronize: false,
          logging: false,
          ssl:
            configService.get<string>('DB_SSL_REJECT_UNAUTHORIZED', 'true') !== 'false'
              ? { rejectUnauthorized: true }
              : { rejectUnauthorized: false },
        }
      },
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: 60000,
            limit: configService.get<number>('RATE_LIMIT_PER_MINUTE', 60),
          },
        ],
      }),
    }),

    ScheduleModule.forRoot(),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => {
        const redisUrl = cfg.get<string>('REDIS_URL')
        if (!redisUrl) {
          return { ttl: 0 }
        }
        return {
          store: await redisStore({ url: redisUrl, ttl: 0 }),
          keyPrefix: 'chm:',
        }
      },
    }),

    HealthModule,
    AuthModule,
    UsersModule,
    CommunitiesModule,
    ProvidersModule,
    ListingsModule,
    BookingsModule,
    ReviewsModule,
    DashboardModule,
    NotificationsModule,
    AdminModule,
    BusinessTemplatesModule,
    PlatformModulesModule,
    MarketModulesModule,
    StoreMarketsModule,
    StoreModulesModule,
    OrdersModule,
    SystemModule,
    ReturnsModule,
    RecommendationsModule,
    MessagesModule,
  ],
})
export class AppModule {}
