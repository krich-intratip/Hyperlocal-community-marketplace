import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProviderSchedule } from './entities/provider-schedule.entity'
import { ProviderHoliday } from './entities/provider-holiday.entity'
import { Provider } from '../providers/entities/provider.entity'
import { SetScheduleDto } from './dto/set-schedule.dto'
import { AddHolidayDto } from './dto/add-holiday.dto'

const DEFAULT_SCHEDULE: Omit<ProviderSchedule, 'id' | 'providerId'>[] = [
  { dayOfWeek: 0, isOpen: false, openTime: '09:00', closeTime: '18:00' }, // Sun
  { dayOfWeek: 1, isOpen: true,  openTime: '09:00', closeTime: '18:00' }, // Mon
  { dayOfWeek: 2, isOpen: true,  openTime: '09:00', closeTime: '18:00' }, // Tue
  { dayOfWeek: 3, isOpen: true,  openTime: '09:00', closeTime: '18:00' }, // Wed
  { dayOfWeek: 4, isOpen: true,  openTime: '09:00', closeTime: '18:00' }, // Thu
  { dayOfWeek: 5, isOpen: true,  openTime: '09:00', closeTime: '18:00' }, // Fri
  { dayOfWeek: 6, isOpen: false, openTime: '09:00', closeTime: '18:00' }, // Sat
]

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ProviderSchedule)
    private readonly scheduleRepo: Repository<ProviderSchedule>,
    @InjectRepository(ProviderHoliday)
    private readonly holidayRepo: Repository<ProviderHoliday>,
    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,
  ) {}

  private async getProviderByUserId(userId: string): Promise<Provider> {
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider) throw new NotFoundException('ไม่พบข้อมูล Provider')
    return provider
  }

  async getScheduleByProviderId(providerId: string): Promise<ProviderSchedule[]> {
    const rows = await this.scheduleRepo.find({
      where: { providerId },
      order: { dayOfWeek: 'ASC' },
    })
    if (rows.length === 0) {
      // Return default schedule if none set
      return DEFAULT_SCHEDULE.map(d => ({ ...d, id: '', providerId } as ProviderSchedule))
    }
    return rows
  }

  async getScheduleByUserId(userId: string): Promise<ProviderSchedule[]> {
    const provider = await this.getProviderByUserId(userId)
    return this.getScheduleByProviderId(provider.id)
  }

  async setSchedule(userId: string, dto: SetScheduleDto): Promise<ProviderSchedule[]> {
    const provider = await this.getProviderByUserId(userId)

    for (const day of dto.days) {
      const existing = await this.scheduleRepo.findOne({
        where: { providerId: provider.id, dayOfWeek: day.dayOfWeek },
      })
      if (existing) {
        existing.isOpen = day.isOpen
        if (day.openTime) existing.openTime = day.openTime
        if (day.closeTime) existing.closeTime = day.closeTime
        await this.scheduleRepo.save(existing)
      } else {
        await this.scheduleRepo.save(
          this.scheduleRepo.create({
            providerId: provider.id,
            dayOfWeek: day.dayOfWeek,
            isOpen: day.isOpen,
            openTime: day.openTime ?? '09:00',
            closeTime: day.closeTime ?? '18:00',
          }),
        )
      }
    }
    return this.getScheduleByProviderId(provider.id)
  }

  async getHolidays(userId: string): Promise<ProviderHoliday[]> {
    const provider = await this.getProviderByUserId(userId)
    return this.holidayRepo.find({
      where: { providerId: provider.id },
      order: { date: 'ASC' },
    })
  }

  async getHolidaysByProviderId(providerId: string): Promise<ProviderHoliday[]> {
    return this.holidayRepo.find({
      where: { providerId },
      order: { date: 'ASC' },
    })
  }

  async addHoliday(userId: string, dto: AddHolidayDto): Promise<ProviderHoliday> {
    const provider = await this.getProviderByUserId(userId)
    const existing = await this.holidayRepo.findOne({
      where: { providerId: provider.id, date: dto.date },
    })
    if (existing) return existing // idempotent
    return this.holidayRepo.save(
      this.holidayRepo.create({ providerId: provider.id, date: dto.date, reason: dto.reason ?? null }),
    )
  }

  async removeHoliday(userId: string, date: string): Promise<{ removed: boolean }> {
    const provider = await this.getProviderByUserId(userId)
    const existing = await this.holidayRepo.findOne({
      where: { providerId: provider.id, date },
    })
    if (!existing) return { removed: false }
    await this.holidayRepo.remove(existing)
    return { removed: true }
  }

  /** Public: Get full schedule info for a provider */
  async getPublicSchedule(providerId: string): Promise<{
    schedule: ProviderSchedule[]
    holidays: ProviderHoliday[]
    todayOpen: boolean
    todayHours: string
  }> {
    const schedule = await this.getScheduleByProviderId(providerId)
    const holidays = await this.getHolidaysByProviderId(providerId)
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const dayOfWeek = today.getDay()
    const isHoliday = holidays.some(h => h.date === todayStr)
    const todaySchedule = schedule.find(s => s.dayOfWeek === dayOfWeek)
    const todayOpen = !isHoliday && (todaySchedule?.isOpen ?? false)
    const todayHours = todayOpen
      ? `${todaySchedule?.openTime} – ${todaySchedule?.closeTime}`
      : 'ปิดวันนี้'
    return { schedule, holidays, todayOpen, todayHours }
  }
}
