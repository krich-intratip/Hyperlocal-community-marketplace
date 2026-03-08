import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { UserRole } from '@chm/shared-types'

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

    return { accessToken, user }
  }

  async validateJwtPayload(payload: { sub: string; email: string; role: UserRole }) {
    return this.usersService.findById(payload.sub)
  }
}
