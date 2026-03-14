import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { CommunitiesModule } from '../communities/communities.module'
import { ProvidersModule } from '../providers/providers.module'
import { User } from '../users/entities/user.entity'
import { Provider } from '../providers/entities/provider.entity'
import { Order } from '../orders/entities/order.entity'
import { Payment } from '../payments/entities/payment.entity'

@Module({
  imports: [
    CommunitiesModule,
    ProvidersModule,
    TypeOrmModule.forFeature([User, Provider, Order, Payment]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
