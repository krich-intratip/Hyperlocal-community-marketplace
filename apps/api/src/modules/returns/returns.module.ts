import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReturnRequest } from './entities/return-request.entity'
import { ReturnsService } from './returns.service'
import { ReturnsController } from './returns.controller'
import { Order } from '../orders/entities/order.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ReturnRequest, Order])],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule {}
