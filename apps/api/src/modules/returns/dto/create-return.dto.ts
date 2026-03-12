import { ReturnReason } from '@chm/shared-types'

export class CreateReturnDto {
  orderId: string
  reason: ReturnReason
  description: string
  evidenceImages?: string[]
}

export class UpdateReturnStatusDto {
  status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REFUNDED'
  refundAmount?: number
  resolutionNote?: string
}
