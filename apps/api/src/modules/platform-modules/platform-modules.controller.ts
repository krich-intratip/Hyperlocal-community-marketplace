import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { PlatformModulesService, UpsertModuleDto } from './platform-modules.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole } from '@chm/shared-types'

@Controller('platform-modules')
export class PlatformModulesController {
  constructor(private readonly service: PlatformModulesService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  findAllIncludeInactive() {
    return this.service.findAllIncludeInactive()
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.service.findByCode(code)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() dto: UpsertModuleDto) {
    return this.service.create(dto)
  }

  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  update(@Param('code') code: string, @Body() dto: Partial<UpsertModuleDto>) {
    return this.service.update(code, dto)
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('code') code: string) {
    return this.service.remove(code)
  }
}
