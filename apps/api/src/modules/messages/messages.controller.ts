import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { MessagesService } from './messages.service'

class StartConversationDto {
  @IsString()
  providerId: string

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message: string

  @IsString()
  @IsOptional()
  orderId?: string
}

class SendMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body: string
}

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /** POST /messages — start a new conversation with a provider */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start (or resume) a conversation with a provider' })
  start(@Req() req: any, @Body() dto: StartConversationDto) {
    return this.messagesService.startConversation(req.user.id, dto)
  }

  /** GET /messages — list all conversations for the authenticated user */
  @Get()
  @ApiOperation({ summary: 'List all conversations for the authenticated user' })
  list(@Req() req: any) {
    return this.messagesService.findConversations(req.user.id)
  }

  // ── Must be declared BEFORE :id to prevent route collision ──────────────────

  /** GET /messages/unread-count — total unread messages (for navbar badge) */
  @Get('unread-count')
  @ApiOperation({ summary: 'Get total unread message count across all conversations' })
  async getUnreadCount(@Req() req: any) {
    const count = await this.messagesService.getUnreadCount(req.user.id)
    return { count }
  }

  /** GET /messages/:id — get all messages in a conversation */
  @Get(':id')
  @ApiOperation({ summary: 'Get all messages in a conversation' })
  getMessages(@Req() req: any, @Param('id') id: string) {
    return this.messagesService.getMessages(id, req.user.id)
  }

  /** POST /messages/:id — send a message in an existing conversation */
  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message in an existing conversation' })
  sendMessage(@Req() req: any, @Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.messagesService.sendMessage(id, req.user.id, dto.body)
  }

  /** PATCH /messages/:id/read — mark conversation as read for the current user */
  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark all messages in a conversation as read' })
  markRead(@Req() req: any, @Param('id') id: string) {
    return this.messagesService.markRead(id, req.user.id)
  }
}
