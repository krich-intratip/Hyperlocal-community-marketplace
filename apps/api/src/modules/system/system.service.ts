import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SystemConfig } from './entities/system-config.entity'

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly repo: Repository<SystemConfig>,
  ) {}

  /** Returns true if training mode is currently active. Defaults to true (safe default). */
  async getTrainingMode(): Promise<boolean> {
    const cfg = await this.repo.findOne({ where: { key: 'TRAINING_MODE_ACTIVE' } })
    if (!cfg) return true // no config row → default to training mode ON
    return cfg.value === 'true'
  }

  /** Toggle training mode ON or OFF. Upserts the config row. */
  async setTrainingMode(active: boolean): Promise<{ success: boolean }> {
    await this.repo.upsert(
      { key: 'TRAINING_MODE_ACTIVE', value: active ? 'true' : 'false' },
      ['key'],
    )
    return { success: true }
  }

  /** Get the full system config for a given key. Returns null if not found. */
  async getConfig(key: string): Promise<string | null> {
    const cfg = await this.repo.findOne({ where: { key } })
    return cfg?.value ?? null
  }

  /** Set an arbitrary system config value. */
  async setConfig(key: string, value: string): Promise<void> {
    await this.repo.upsert({ key, value }, ['key'])
  }
}
