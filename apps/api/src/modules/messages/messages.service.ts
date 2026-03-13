import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Not } from 'typeorm'
import { Conversation } from './entities/conversation.entity'
import { Message } from './entities/message.entity'
import { Provider } from '../providers/entities/provider.entity'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private readonly convRepo: Repository<Conversation>,

    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,

    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,
  ) {}

  /** Start a conversation (or reuse existing) and send the first message */
  async startConversation(
    customerId: string,
    dto: { providerId: string; orderId?: string; message: string },
  ): Promise<{ conversation: Conversation; messages: Message[] }> {
    const provider = await this.providerRepo.findOne({ where: { id: dto.providerId } })
    if (!provider) throw new NotFoundException(`Provider ${dto.providerId} not found`)

    // Reuse existing conversation between same customer+provider (and same order if given)
    let conv = await this.convRepo.findOne({
      where: {
        customerId,
        providerId: dto.providerId,
        ...(dto.orderId ? { orderId: dto.orderId } : {}),
      },
    })

    const preview = dto.message.slice(0, 100)
    const now = new Date()

    if (!conv) {
      conv = await this.convRepo.save(
        this.convRepo.create({
          customerId,
          providerId: dto.providerId,
          providerUserId: provider.userId,
          providerDisplayName: provider.displayName,
          orderId: dto.orderId ?? null,
          lastMessagePreview: preview,
          lastMessageAt: now,
        }),
      )
    } else {
      await this.convRepo.update(conv.id, { lastMessagePreview: preview, lastMessageAt: now })
    }

    const msg = await this.msgRepo.save(
      this.msgRepo.create({ conversationId: conv.id, senderId: customerId, body: dto.message }),
    )

    return { conversation: conv, messages: [msg] }
  }

  /** List all conversations for a user (customer or provider) with per-conversation unread count */
  async findConversations(userId: string): Promise<Array<Conversation & { unreadCount: number }>> {
    const convs = await this.convRepo.find({
      where: [{ customerId: userId }, { providerUserId: userId }],
      order: { lastMessageAt: 'DESC' },
    })

    return Promise.all(
      convs.map(async (c) => {
        const unreadCount = await this.msgRepo.count({
          where: { conversationId: c.id, senderId: Not(userId), isRead: false },
        })
        return Object.assign(c, { unreadCount })
      }),
    )
  }

  /** Total unread message count across all conversations (for navbar badge) */
  async getUnreadCount(userId: string): Promise<number> {
    const convIds = await this.convRepo.find({
      where: [{ customerId: userId }, { providerUserId: userId }],
      select: ['id'],
    })
    if (convIds.length === 0) return 0
    return this.msgRepo.count({
      where: {
        conversationId: In(convIds.map((c) => c.id)),
        senderId: Not(userId),
        isRead: false,
      },
    })
  }

  /** Get messages in a conversation — validates caller is a participant */
  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } })
    if (!conv) throw new NotFoundException('Conversation not found')
    if (conv.customerId !== userId && conv.providerUserId !== userId)
      throw new ForbiddenException('Access denied')

    return this.msgRepo.find({ where: { conversationId }, order: { createdAt: 'ASC' } })
  }

  /** Send a message in an existing conversation */
  async sendMessage(conversationId: string, senderId: string, body: string): Promise<Message> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } })
    if (!conv) throw new NotFoundException('Conversation not found')
    if (conv.customerId !== senderId && conv.providerUserId !== senderId)
      throw new ForbiddenException('Access denied')

    const msg = await this.msgRepo.save(
      this.msgRepo.create({ conversationId, senderId, body }),
    )
    await this.convRepo.update(conversationId, {
      lastMessagePreview: body.slice(0, 100),
      lastMessageAt: new Date(),
    })
    return msg
  }

  /** Mark all messages from the OTHER party in this conversation as read */
  async markRead(conversationId: string, userId: string): Promise<void> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } })
    if (!conv) return
    if (conv.customerId !== userId && conv.providerUserId !== userId) return
    await this.msgRepo.update(
      { conversationId, senderId: Not(userId), isRead: false },
      { isRead: true },
    )
  }
}
