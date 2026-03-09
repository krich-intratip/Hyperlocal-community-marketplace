import {
    Controller, Get, Post, Patch, Param, Body, Query,
    UseGuards, Request,
} from '@nestjs/common'
import { CommissionService } from './commission.service'

// TODO: replace with actual guards once auth module is wired
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
// import { RolesGuard } from '../auth/guards/roles.guard'
// import { Roles } from '../auth/decorators/roles.decorator'
// import { UserRole } from '@chm/shared-types'

@Controller('commission')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CommissionController {
    constructor(private readonly commissionService: CommissionService) { }

    /** GET /commission/overrides — List active rate overrides (Super Admin) */
    @Get('overrides')
    listOverrides(@Query('communityId') communityId?: string) {
        return this.commissionService.listOverrides(communityId)
    }

    /** POST /commission/overrides — Create a new rate override (Super Admin) */
    @Post('overrides')
    // @Roles(UserRole.SUPER_ADMIN)
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
            createdBy: req.user?.id ?? 'system',
        })
    }

    /** PATCH /commission/overrides/:id/deactivate — Deactivate an override */
    @Patch('overrides/:id/deactivate')
    // @Roles(UserRole.SUPER_ADMIN)
    deactivateOverride(@Param('id') id: string) {
        return this.commissionService.deactivateOverride(id)
    }
}
