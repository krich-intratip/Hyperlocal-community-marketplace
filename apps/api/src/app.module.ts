import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
        synchronize: configService.get<string>('APP_ENV') === 'development',
        logging: configService.get<string>('APP_ENV') === 'development',
        ssl:
          configService.get<string>('APP_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
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
  ],
})
export class AppModule {}
