import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { BusinessTemplatesService, UpsertTemplateDto } from './business-templates.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole } from '@chm/shared-types'

@Controller('business-templates')
export class BusinessTemplatesController {
  constructor(private readonly service: BusinessTemplatesService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.service.findByCode(code)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() dto: UpsertTemplateDto) {
    return this.service.create(dto)
  }

  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  update(@Param('code') code: string, @Body() dto: Partial<UpsertTemplateDto>) {
    return this.service.update(code, dto)
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('code') code: string) {
    return this.service.remove(code)
  }
}
