import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { CommunitiesModule } from '../communities/communities.module'
import { ProvidersModule } from '../providers/providers.module'

@Module({
  imports: [CommunitiesModule, ProvidersModule],
  controllers: [AdminController],
})
export class AdminModule {}
