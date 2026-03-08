import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Review } from './entities/review.entity'

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async create(reviewerId: string, data: { bookingId: string; providerId: string; rating: number; comment?: string }) {
    const existing = await this.reviewRepo.findOne({ where: { bookingId: data.bookingId } })
    if (existing) throw new ConflictException('Review already exists for this booking')
    const review = this.reviewRepo.create({ reviewerId, ...data })
    return this.reviewRepo.save(review)
  }

  async findByProvider(providerId: string) {
    return this.reviewRepo.find({ where: { providerId }, order: { createdAt: 'DESC' } })
  }

  async getProviderStats(providerId: string) {
    const result = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'averageRating')
      .addSelect('COUNT(r.id)', 'totalReviews')
      .where('r.provider_id = :providerId', { providerId })
      .getRawOne()
    return { averageRating: parseFloat(result.averageRating) || 0, totalReviews: parseInt(result.totalReviews) || 0 }
  }

  async flag(id: string) {
    const review = await this.reviewRepo.findOne({ where: { id } })
    if (!review) throw new NotFoundException('Review not found')
    await this.reviewRepo.update(id, { isFlagged: true })
    return { success: true }
  }
}
