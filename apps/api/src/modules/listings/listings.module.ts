import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ListingsController } from './listings.controller'
import { ListingsService } from './listings.service'
import { Listing } from './entities/listing.entity'
import { Provider } from '../providers/entities/provider.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Provider])],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
