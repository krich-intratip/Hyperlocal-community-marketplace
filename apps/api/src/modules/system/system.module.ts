import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemConfig } from './entities/system-config.entity'
import { SystemService } from './system.service'
import { SystemController } from './system.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SystemConfig])],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
