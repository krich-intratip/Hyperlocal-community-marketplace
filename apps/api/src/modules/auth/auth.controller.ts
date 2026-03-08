import { Controller, Get, Post, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService, OAuthUser } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

const IS_PROD = process.env.APP_ENV === 'production'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback — sets httpOnly cookie, redirects to frontend' })
  async googleAuthCallback(
    @Req() req: FastifyRequest & { user: OAuthUser },
    @Res() res: FastifyReply,
  ) {
    const result = await this.authService.loginWithOAuth(req.user)
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')
    const maxAgeSec = 60 * this.configService.get<number>('JWT_EXPIRES_MINUTES', 1440)
    const cookieFlags = [
      `access_token=${result.accessToken}`,
      'HttpOnly',
      `Max-Age=${maxAgeSec}`,
      'Path=/',
      IS_PROD ? 'Secure' : '',
      `SameSite=${IS_PROD ? 'Strict' : 'Lax'}`,
    ].filter(Boolean).join('; ')

    res.header('Set-Cookie', cookieFlags)
    return res.redirect(`${frontendUrl}/auth/callback`)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@Req() req: FastifyRequest & { user: OAuthUser }) {
    return req.user
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear auth cookie and logout' })
  logout(@Res({ passthrough: true }) res: FastifyReply) {
    res.header('Set-Cookie', 'access_token=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax')
    return { success: true, message: 'Logged out successfully' }
  }
}
