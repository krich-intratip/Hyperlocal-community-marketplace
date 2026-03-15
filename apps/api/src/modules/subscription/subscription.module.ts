import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProviderSubscription } from './entities/provider-subscription.entity'
import { SubscriptionService } from './subscription.service'
import { SubscriptionController } from './subscription.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProviderSubscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
