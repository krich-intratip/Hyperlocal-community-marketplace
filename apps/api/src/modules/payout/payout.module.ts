import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { PayoutService } from './payout.service'
import { PayoutController } from './payout.controller'
import { Payout } from './entities/payout.entity'
import { Community } from '../communities/entities/community.entity'
import { CommissionModule } from '../commission/commission.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Payout, Community]),
        CommissionModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [PayoutController],
    providers: [PayoutService],
    exports: [PayoutService],
})
export class PayoutModule { }
