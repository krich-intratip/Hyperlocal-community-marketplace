import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { Report } from './entities/report.entity'
import { CreateReportDto } from './dto/create-report.dto'
import { ResolveReportDto } from './dto/resolve-report.dto'
import { ReportStatus, ReportType } from '@chm/shared-types'

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
  ) {}

  /** Submit a report (authenticated user) */
  async create(reporterId: string, dto: CreateReportDto): Promise<Report> {
    // Prevent duplicate pending reports from the same user for the same target
    const existing = await this.reportRepo.findOne({
      where: { reporterId, targetId: dto.targetId, status: ReportStatus.PENDING },
    })
    if (existing) {
      throw new ConflictException('คุณได้รายงานรายการนี้ไปแล้ว')
    }
    const report = this.reportRepo.create({
      reporterId,
      type: dto.type,
      targetId: dto.targetId,
      reason: dto.reason,
      description: dto.description ?? null,
    })
    return this.reportRepo.save(report)
  }

  /** SuperAdmin: list all reports with optional filters */
  async listAll(status?: ReportStatus, type?: ReportType): Promise<Report[]> {
    const where: FindOptionsWhere<Report> = {}
    if (status) where.status = status
    if (type) where.type = type
    return this.reportRepo.find({
      where,
      order: { createdAt: 'DESC' },
    })
  }

  /** SuperAdmin: resolve or dismiss a report */
  async resolve(id: string, adminId: string, dto: ResolveReportDto): Promise<Report> {
    const report = await this.reportRepo.findOne({ where: { id } })
    if (!report) throw new NotFoundException('ไม่พบ Report')
    report.status = dto.status
    report.adminNote = dto.adminNote ?? null
    report.resolvedBy = adminId
    report.resolvedAt = new Date()
    return this.reportRepo.save(report)
  }

  /** Get report counts by status (for admin dashboard KPIs) */
  async getStats(): Promise<{ pending: number; resolved: number; dismissed: number; total: number }> {
    const [pending, resolved, dismissed, total] = await Promise.all([
      this.reportRepo.count({ where: { status: ReportStatus.PENDING } }),
      this.reportRepo.count({ where: { status: ReportStatus.RESOLVED } }),
      this.reportRepo.count({ where: { status: ReportStatus.DISMISSED } }),
      this.reportRepo.count(),
    ])
    return { pending, resolved, dismissed, total }
  }
}
