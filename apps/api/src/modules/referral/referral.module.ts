import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Referral } from './entities/referral.entity'
import { ReferralService } from './referral.service'
import { ReferralController } from './referral.controller'
import { LoyaltyModule } from '../loyalty/loyalty.module'

@Module({
  imports: [TypeOrmModule.forFeature([Referral]), LoyaltyModule],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
