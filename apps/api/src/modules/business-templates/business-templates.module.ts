import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BusinessTemplate } from './entities/business-template.entity'
import { BusinessTemplatesService } from './business-templates.service'
import { BusinessTemplatesController } from './business-templates.controller'

@Module({
  imports: [TypeOrmModule.forFeature([BusinessTemplate])],
  controllers: [BusinessTemplatesController],
  providers: [BusinessTemplatesService],
  exports: [BusinessTemplatesService],
})
export class BusinessTemplatesModule {}
