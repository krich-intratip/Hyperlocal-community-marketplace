import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ReturnRequest } from './entities/return-request.entity'
import { ReturnStatus } from '@chm/shared-types'
import { CreateReturnDto, UpdateReturnStatusDto } from './dto/create-return.dto'
import { Order } from '../orders/entities/order.entity'

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(ReturnRequest)
    private readonly returnRepo: Repository<ReturnRequest>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(customerId: string, dto: CreateReturnDto): Promise<ReturnRequest> {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } })
    if (!order) throw new NotFoundException('Order not found')
    if (order.customerId !== customerId) throw new ForbiddenException('Not your order')

    const existing = await this.returnRepo.findOne({ where: { orderId: dto.orderId } })
    if (existing) throw new BadRequestException('Return request already exists for this order')

    const req = this.returnRepo.create({
      ...dto,
      customerId,
      evidenceImages: dto.evidenceImages ?? null,
      status: ReturnStatus.PENDING,
    })
    return this.returnRepo.save(req)
  }

  async findByOrderId(orderId: string, customerId: string): Promise<ReturnRequest | null> {
    const req = await this.returnRepo.findOne({ where: { orderId } })
    if (!req) return null
    if (req.customerId !== customerId) throw new ForbiddenException('Not your order')
    return req
  }

  async findAll(filters: { status?: ReturnStatus; page?: number; limit?: number }) {
    const page = Math.max(1, filters.page ?? 1)
    const limit = Math.min(50, filters.limit ?? 20)
    const where: any = {}
    if (filters.status) where.status = filters.status
    const [data, total] = await this.returnRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total, page, limit }
  }

  async updateStatus(id: string, dto: UpdateReturnStatusDto): Promise<ReturnRequest> {
    const req = await this.returnRepo.findOne({ where: { id } })
    if (!req) throw new NotFoundException('Return request not found')

    const update: Partial<ReturnRequest> = { status: dto.status as ReturnStatus }
    if (dto.resolutionNote !== undefined) update.resolutionNote = dto.resolutionNote
    if (dto.refundAmount !== undefined) update.refundAmount = dto.refundAmount
    if (['APPROVED', 'REJECTED', 'REFUNDED'].includes(dto.status)) {
      update.resolvedAt = new Date()
    }

    await this.returnRepo.update(id, update)
    return this.returnRepo.findOne({ where: { id } }) as Promise<ReturnRequest>
  }
}
