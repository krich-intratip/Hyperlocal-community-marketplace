import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

/**
 * CommissionRateOverride
 * Allows Super Admins to temporarily or permanently adjust the platform commission rate
 * for specific communities or provider types (e.g. 7% for FOOD providers during a promotion).
 *
 * Lookup priority:
 *   1. Active override matching both communityId AND providerType (most specific)
 *   2. Active override matching only communityId (community-wide)
 *   3. Active override with communityId=null (global, all communities)
 *   4. Community.commissionRate (default fallback)
 *
 * "Active" = isActive=true AND validFrom <= NOW AND (validTo IS NULL OR validTo >= NOW)
 */
@Entity('commission_rate_overrides')
export class CommissionRateOverride {
    @PrimaryGeneratedColumn('uuid')
    id: string

    /**
     * null = applies to ALL communities (global override).
     * Specific communityId = applies only to that community.
     */
    @Column({ name: 'community_id', nullable: true })
    communityId: string

    /**
     * null = applies to ALL provider types within the target community scope.
     * Value = MarketplaceCategory enum string (e.g. 'FOOD', 'REPAIR').
     */
    @Column({ name: 'provider_type', nullable: true })
    providerType: string

    /** The override commission rate (%) to use instead of the community default */
    @Column({ name: 'override_rate', type: 'decimal', precision: 5, scale: 2 })
    overrideRate: number

    @Column({ name: 'valid_from', type: 'datetime' })
    validFrom: Date

    /** null = no expiry (permanent override) */
    @Column({ name: 'valid_to', nullable: true, type: 'datetime' })
    validTo: Date

    /** Human-readable reason / promotion name */
    @Column({ name: 'reason', nullable: true, type: 'text' })
    reason: string

    /** Super Admin userId who created this override */
    @Column({ name: 'created_by' })
    createdBy: string

    @Column({ name: 'is_active', default: true })
    isActive: boolean

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}
