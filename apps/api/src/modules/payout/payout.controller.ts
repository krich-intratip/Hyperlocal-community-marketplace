import {
    Controller, Get, Patch, Param, Body, Query, Request, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { PayoutService } from './payout.service'
import { PayoutStatus, UserRole } from '@chm/shared-types'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('Payouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payouts')
export class PayoutController {
    constructor(private readonly payoutService: PayoutService) { }

    /**
     * GET /payouts — All payouts (Super Admin)
     * Query: ?status=DRAFT&period=2026-03&communityId=uuid
     */
    @Get()
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'List all payouts (Super Admin only)' })
    findAll(
        @Query('status') status?: PayoutStatus,
        @Query('period') period?: string,
        @Query('communityId') communityId?: string,
    ) {
        return this.payoutService.findAll({ status, period, communityId })
    }

    /** GET /payouts/community/:id — CA's payout history for their community */
    @Get('community/:id')
    @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: "Get community's payout history (CA or Super Admin)" })
    findByCommunity(@Param('id') communityId: string) {
        return this.payoutService.findByCommunity(communityId)
    }

    /** GET /payouts/:id — Single payout detail */
    @Get(':id')
    @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Get single payout detail (CA or Super Admin)' })
    findOne(@Param('id') id: string) {
        return this.payoutService.findOne(id)
    }

    /** PATCH /payouts/:id/approve — Super Admin approves a payout */
    @Patch(':id/approve')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Approve a payout (Super Admin only)' })
    approve(@Param('id') id: string, @Request() req: any) {
        return this.payoutService.approve(id, req.user.id)
    }

    /** PATCH /payouts/:id/mark-paid — Super Admin marks payout as paid with evidence */
    @Patch(':id/mark-paid')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Mark a payout as paid (Super Admin only)' })
    markPaid(
        @Param('id') id: string,
        @Body() body: {
            paymentReference: string
            paymentEvidenceUrl?: string
            notes?: string
        },
    ) {
        return this.payoutService.markPaid(id, body)
    }
}
