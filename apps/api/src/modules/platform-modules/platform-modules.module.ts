import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlatformModule } from './entities/platform-module.entity'
import { PlatformModulesService } from './platform-modules.service'
import { PlatformModulesController } from './platform-modules.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PlatformModule])],
  controllers: [PlatformModulesController],
  providers: [PlatformModulesService],
  exports: [PlatformModulesService],
})
export class PlatformModulesModule {}
