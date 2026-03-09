import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

/**
 * ShippingProvider
 * Registry of supported logistics providers for cross-community delivery.
 * This is a SKELETON entity — actual API integration logic is TBD.
 *
 * Design note:
 * - Shipping costs are EXCLUDED from commission calculation.
 *   commissionableAmount = booking.totalAmount - booking.shippingAmount
 * - Each booking records shippingProviderId to know which carrier was used.
 * - apiKey is stored encrypted (app-level encryption before saving).
 */
@Entity('shipping_providers')
export class ShippingProvider {
    @PrimaryGeneratedColumn('uuid')
    id: string

    /** Display name (e.g. "Lalamove", "Flash Express", "Kerry Express") */
    @Column({ name: 'name' })
    name: string

    /** Unique slug for code references (e.g. "lalamove", "flash", "grab") */
    @Column({ name: 'slug', unique: true })
    slug: string

    /** Encrypted API key for calling the logistics provider's API */
    @Column({ name: 'api_key_encrypted', nullable: true, type: 'text' })
    apiKeyEncrypted: string

    /** Webhook URL to receive delivery status updates from the carrier */
    @Column({ name: 'webhook_url', nullable: true })
    webhookUrl: string

    @Column({ name: 'is_active', default: false })
    isActive: boolean

    /**
     * JSON array of province codes where this carrier operates.
     * Example: ["BKK", "NNT", "PTH"]
     * null = nationwide coverage
     */
    @Column({ name: 'supported_regions', nullable: true, type: 'text' })
    supportedRegions: string

    /**
     * JSON object describing the base fee calculation formula.
     * Structure TBD per carrier integration.
     * Example: { "base": 50, "perKm": 5, "maxKm": 50 }
     */
    @Column({ name: 'base_fee_formula', nullable: true, type: 'text' })
    baseFeeFormula: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}
