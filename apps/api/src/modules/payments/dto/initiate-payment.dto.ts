import { IsEnum, IsString, IsNotEmpty } from 'class-validator'

export class InitiatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string

  @IsEnum(['promptpay', 'card', 'cod'])
  method: 'promptpay' | 'card' | 'cod'
}
