import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'
import { Listing } from '../listings/entities/listing.entity'
import { Provider } from '../providers/entities/provider.entity'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Listing, Provider]),
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
