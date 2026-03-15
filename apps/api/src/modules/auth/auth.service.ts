import { Injectable, ConflictException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { AuditAction, UserRole } from '@chm/shared-types'
import { ReferralService } from '../referral/referral.service'
import { AuditService } from '../audit/audit.service'

export interface OAuthUser {
  googleId?: string
  email: string
  displayName: string
  avatarUrl?: string
  provider: 'google' | 'line'
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ReferralService))
    private readonly referralService: ReferralService,
    private readonly auditService: AuditService,
  ) {}

  async loginWithOAuth(oauthUser: OAuthUser) {
    let user = await this.usersService.findByEmail(oauthUser.email)

    if (!user) {
      user = await this.usersService.create({
        email: oauthUser.email,
        displayName: oauthUser.displayName,
        avatarUrl: oauthUser.avatarUrl,
        loginProvider: oauthUser.provider,
        role: UserRole.CUSTOMER,
      })
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload)

    this.auditService.log({
      userId: user.id,
      action: AuditAction.LOGIN_SUCCESS,
      meta: { provider: oauthUser.provider },
      success: true,
    })

    return { accessToken, user }
  }

  async registerWithEmail(data: {
    email: string
    password: string
    displayName: string
    role: UserRole
    phone?: string
    referralCode?: string
  }) {
    const existing = await this.usersService.findByEmail(data.email)
    if (existing) throw new ConflictException('อีเมลนี้มีผู้ใช้งานแล้ว')

    const passwordHash = await bcrypt.hash(data.password, 12)
    const user = await this.usersService.create({
      email: data.email,
      displayName: data.displayName,
      loginProvider: 'email',
      role: data.role,
      phone: data.phone,
      passwordHash,
    })

    if (data.referralCode) {
      await this.referralService.applyReferralCode(data.referralCode, user.id).catch(() => {})
    }

    this.auditService.log({
      userId: user.id,
      action: AuditAction.REGISTER,
      meta: { role: data.role },
      success: true,
    })

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload)
    return { accessToken, user }
  }

  async loginWithEmail(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email)
    if (!user || !user.passwordHash) {
      this.auditService.log({
        userId: null,
        action: AuditAction.LOGIN_FAILED,
        meta: { email },
        success: false,
      })
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      this.auditService.log({
        userId: user.id,
        action: AuditAction.LOGIN_FAILED,
        meta: { email },
        success: false,
      })
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }

    this.auditService.log({
      userId: user.id,
      action: AuditAction.LOGIN_SUCCESS,
      meta: { provider: 'email' },
      success: true,
    })

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload)
    return { accessToken, user }
  }

  async validateJwtPayload(payload: { sub: string; email: string; role: UserRole }) {
    return this.usersService.findById(payload.sub)
  }
}
