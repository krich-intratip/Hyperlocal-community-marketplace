import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MarketModule } from './entities/market-module.entity'
import { MarketModulesService } from './market-modules.service'
import { MarketModulesController } from './market-modules.controller'

@Module({
  imports: [TypeOrmModule.forFeature([MarketModule])],
  controllers: [MarketModulesController],
  providers: [MarketModulesService],
  exports: [MarketModulesService],
})
export class MarketModulesModule {}
