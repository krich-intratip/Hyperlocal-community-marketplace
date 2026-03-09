import {
    Controller, Get, Patch, Param, Body, Query, Request,
} from '@nestjs/common'
import { PayoutService } from './payout.service'
import { PayoutStatus } from '@chm/shared-types'

@Controller('payouts')
export class PayoutController {
    constructor(private readonly payoutService: PayoutService) { }

    /**
     * GET /payouts — All payouts (Super Admin)
     * Query: ?status=DRAFT&period=2026-03&communityId=uuid
     */
    @Get()
    findAll(
        @Query('status') status?: PayoutStatus,
        @Query('period') period?: string,
        @Query('communityId') communityId?: string,
    ) {
        return this.payoutService.findAll({ status, period, communityId })
    }

    /** GET /payouts/:id — Single payout detail */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.payoutService.findOne(id)
    }

    /** GET /payouts/community/:id — CA's payout history for their community */
    @Get('community/:id')
    findByCommunity(@Param('id') communityId: string) {
        return this.payoutService.findByCommunity(communityId)
    }

    /** PATCH /payouts/:id/approve — Super Admin approves a payout */
    @Patch(':id/approve')
    approve(@Param('id') id: string, @Request() req: any) {
        return this.payoutService.approve(id, req.user?.id ?? 'system')
    }

    /** PATCH /payouts/:id/mark-paid — Super Admin marks payout as paid with evidence */
    @Patch(':id/mark-paid')
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
