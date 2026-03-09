import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommissionService } from './commission.service'
import { CommissionController } from './commission.controller'
import { CommissionLedger } from './entities/commission-ledger.entity'
import { CommissionRateOverride } from './entities/commission-rate-override.entity'

@Module({
    imports: [TypeOrmModule.forFeature([CommissionLedger, CommissionRateOverride])],
    controllers: [CommissionController],
    providers: [CommissionService],
    exports: [CommissionService], // exported so bookings module can use it
})
export class CommissionModule { }
