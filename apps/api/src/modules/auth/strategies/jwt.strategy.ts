import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'
import { UserRole } from '@chm/shared-types'
import { AuthService } from '../auth.service'

/** Extract JWT from httpOnly cookie first, fall back to Bearer header */
function cookieOrBearerExtractor(req: Request): string | null {
  const cookie = (req?.cookies as Record<string, string> | undefined)?.access_token
  if (cookie) return cookie
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: cookieOrBearerExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: false,
    })
  }

  async validate(payload: { sub: string; email: string; role: UserRole }) {
    const user = await this.authService.validateJwtPayload(payload)
    if (!user) throw new UnauthorizedException()
    return user
  }
}
