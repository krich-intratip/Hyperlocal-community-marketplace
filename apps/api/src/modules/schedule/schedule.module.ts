import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProviderSchedule } from './entities/provider-schedule.entity'
import { ProviderHoliday } from './entities/provider-holiday.entity'
import { Provider } from '../providers/entities/provider.entity'
import { ScheduleService } from './schedule.service'
import { ProviderSchedulePublicController, ProviderScheduleMeController } from './schedule.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProviderSchedule, ProviderHoliday, Provider])],
  controllers: [ProviderScheduleMeController, ProviderSchedulePublicController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ProviderScheduleModule {}
