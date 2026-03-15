import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'
import { Listing } from '../listings/entities/listing.entity'
import { Provider } from '../providers/entities/provider.entity'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { NotificationsModule } from '../notifications/notifications.module'
import { LoyaltyModule } from '../loyalty/loyalty.module'
import { ReferralModule } from '../referral/referral.module'
import { CouponModule } from '../coupon/coupon.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Listing, Provider]),
    NotificationsModule,
    LoyaltyModule,
    ReferralModule,
    CouponModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
