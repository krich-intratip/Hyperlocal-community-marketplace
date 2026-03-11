import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoreModule } from './entities/store-module.entity'
import { StoreModulesService } from './store-modules.service'
import { StoreModulesController } from './store-modules.controller'

@Module({
  imports: [TypeOrmModule.forFeature([StoreModule])],
  controllers: [StoreModulesController],
  providers: [StoreModulesService],
  exports: [StoreModulesService],
})
export class StoreModulesModule {}
