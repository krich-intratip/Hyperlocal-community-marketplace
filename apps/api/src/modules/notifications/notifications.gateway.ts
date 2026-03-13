import { Injectable, Logger } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { NotificationType } from '@chm/shared-types'

/**
 * NotificationsGateway — WebSocket gateway stub for real-time notifications.
 *
 * ── SETUP REQUIRED ─────────────────────────────────────────────────────────
 * To activate WebSocket support, install these packages:
 *   pnpm --filter @chm/api add @nestjs/websockets @nestjs/platform-ws ws
 *   pnpm --filter @chm/api add -D @types/ws
 *
 * Then:
 *   1. Replace this stub with a proper @WebSocketGateway class (see commented code below)
 *   2. Register WsAdapter in main.ts:
 *      import { WsAdapter } from '@nestjs/platform-ws'
 *      app.useWebSocketAdapter(new WsAdapter(app))
 *   3. Add NotificationsGateway to providers in notifications.module.ts
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Future gateway shape (requires @nestjs/websockets + ws):
 *
 * @WebSocketGateway({ path: '/ws/notifications' })
 * export class NotificationsGateway
 *   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
 *
 *   @WebSocketServer() private server: Server
 *   private readonly clients = new Map<string, WebSocket>()
 *
 *   afterInit()                  { this.logger.log('Gateway ready') }
 *   handleConnection(client)     { this.logger.log('Client connected') }
 *   handleDisconnect(client)     { this.clients.delete(client.userId) }
 *
 *   registerClient(userId, ws)   { this.clients.set(userId, ws) }
 *
 *   sendToUser(userId, payload)  {
 *     const ws = this.clients.get(userId)
 *     if (ws?.readyState === ws.OPEN) ws.send(JSON.stringify(payload))
 *   }
 *
 *   broadcast(payload)           {
 *     this.clients.forEach(ws => ws.readyState === ws.OPEN && ws.send(JSON.stringify(payload)))
 *   }
 * }
 */
@Injectable()
export class NotificationsGateway {
  private readonly logger = new Logger(NotificationsGateway.name)

  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Sends a notification to a specific user.
   * Stub: currently logs only. Will push via WebSocket once gateway is activated.
   */
  async sendToUser(
    userId: string,
    type: NotificationType,
    payload: Record<string, unknown>,
  ): Promise<void> {
    this.logger.log(`[WS-STUB] → userId=${userId} type=${type}`)
    const title = String(payload['title'] ?? type)
    const body  = String(payload['body']  ?? '')
    await this.notificationsService.send(userId, type, title, body, { data: payload })
  }

  /**
   * Broadcasts a system-wide notification to all connected clients.
   * Stub: currently logs only.
   */
  broadcastSystem(payload: Record<string, unknown>): void {
    this.logger.log(`[WS-STUB] broadcast payload=${JSON.stringify(payload)}`)
  }
}
