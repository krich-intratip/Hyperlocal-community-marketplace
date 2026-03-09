import {
    Controller, Get, Post, Patch, Param, Body, Query,
    UseGuards, Request,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { CommissionService } from './commission.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole } from '@chm/shared-types'

@ApiTags('Commission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('commission')
export class CommissionController {
    constructor(private readonly commissionService: CommissionService) { }

    /** GET /commission/overrides — List active rate overrides (Super Admin) */
    @Get('overrides')
    @ApiOperation({ summary: 'List commission rate overrides (Super Admin only)' })
    listOverrides(@Query('communityId') communityId?: string) {
        return this.commissionService.listOverrides(communityId)
    }

    /** POST /commission/overrides — Create a new rate override (Super Admin) */
    @Post('overrides')
    @ApiOperation({ summary: 'Create a commission rate override (Super Admin only)' })
    createOverride(
        @Body() body: {
            communityId?: string
            providerType?: string
            overrideRate: number
            validFrom: string
            validTo?: string
            reason?: string
        },
        @Request() req: any,
    ) {
        return this.commissionService.createOverride({
            ...body,
            validFrom: new Date(body.validFrom),
            validTo: body.validTo ? new Date(body.validTo) : undefined,
            createdBy: req.user.id,
        })
    }

    /** PATCH /commission/overrides/:id/deactivate — Deactivate an override */
    @Patch('overrides/:id/deactivate')
    @ApiOperation({ summary: 'Deactivate a commission rate override (Super Admin only)' })
    deactivateOverride(@Param('id') id: string) {
        return this.commissionService.deactivateOverride(id)
    }
}
