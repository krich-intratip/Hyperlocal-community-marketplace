import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum OrderStatus {
  PENDING_PAYMENT       = 'PENDING_PAYMENT',
  PAYMENT_HELD          = 'PAYMENT_HELD',
  CONFIRMED             = 'CONFIRMED',
  IN_PROGRESS           = 'IN_PROGRESS',
  PENDING_CONFIRMATION  = 'PENDING_CONFIRMATION',
  COMPLETED             = 'COMPLETED',
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',
  CANCELLED_BY_PROVIDER = 'CANCELLED_BY_PROVIDER',
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    description: 'New order status (role-gated transitions enforced server-side)',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus
}
