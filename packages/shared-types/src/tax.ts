import { TaxType, TaxApplyTo } from './enums'

export interface TaxConfig {
  id: string
  taxName: string
  taxCode: string
  taxType: TaxType
  rate: number
  applyTo: TaxApplyTo
  borneBy: 'CUSTOMER' | 'PROVIDER' | 'PLATFORM'
  isInclusive: boolean
  applicableCategories?: string    // JSON array of MarketplaceCategory
  applicableCommunityIds?: string  // JSON array of community UUIDs (null = all)
  thresholdAmount?: number
  isActive: boolean
  effectiveFrom: string
  effectiveTo?: string
  createdBySaId: string
  lastUpdatedBySaId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaxConfigDto {
  taxName: string
  taxCode: string
  taxType: TaxType
  rate: number
  applyTo: TaxApplyTo
  borneBy: 'CUSTOMER' | 'PROVIDER' | 'PLATFORM'
  isInclusive: boolean
  applicableCategories?: string[]
  applicableCommunityIds?: string[]
  thresholdAmount?: number
  effectiveFrom: string
  effectiveTo?: string
  notes?: string
}

export interface UpdateTaxConfigDto {
  isActive?: boolean
  effectiveTo?: string
  notes?: string
}
