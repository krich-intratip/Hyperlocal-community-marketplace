import { Controller, Get, Post, Body, Req, Res, UseGuards, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { Throttle } from '@nestjs/throttler'
import { AuthService, OAuthUser } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { UserRole } from '@chm/shared-types'

class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  displayName: string

  @IsIn(['customer', 'provider', 'admin'])
  role: 'customer' | 'provider' | 'admin'

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  referralCode?: string
}

class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

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

  @Post('register')
  @Throttle({ short: { ttl: 60000, limit: 3 }, medium: { ttl: 3600000, limit: 10 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register with email + password' })
  @ApiBody({ type: RegisterDto })
  async register(
    @Body() body: RegisterDto,
    @Res() res: FastifyReply,
  ) {
    if (!body.email || !body.password || !body.displayName || !body.role) {
      throw new BadRequestException('กรุณากรอกข้อมูลให้ครบถ้วน')
    }

    const roleMap: Record<string, UserRole> = {
      customer: UserRole.CUSTOMER,
      provider: UserRole.PROVIDER,
      admin: UserRole.COMMUNITY_ADMIN,
    }

    const result = await this.authService.registerWithEmail({
      email: body.email,
      password: body.password,
      displayName: body.displayName,
      role: roleMap[body.role] ?? UserRole.CUSTOMER,
      phone: body.phone,
      referralCode: body.referralCode,
    })

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
    return res.status(HttpStatus.CREATED).send({
      id: result.user.id,
      email: result.user.email,
      displayName: result.user.displayName,
      role: result.user.role,
      avatarUrl: result.user.avatarUrl,
    })
  }

  @Post('login')
  @Throttle({ short: { ttl: 60000, limit: 5 }, medium: { ttl: 3600000, limit: 20 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email + password' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() body: LoginDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.authService.loginWithEmail(body.email, body.password)

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
    return res.send({
      id: result.user.id,
      email: result.user.email,
      displayName: result.user.displayName,
      role: result.user.role,
      avatarUrl: result.user.avatarUrl,
    })
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
