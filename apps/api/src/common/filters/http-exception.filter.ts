import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const reply = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const isProduction = process.env.APP_ENV === 'production'

    // Log full error server-side always
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      )
    } else {
      this.logger.warn(`[${request.method}] ${request.url} → ${status}`)
    }

    // Sanitise response: never leak stack traces or internal details in production
    const responseBody =
      exception instanceof HttpException ? exception.getResponse() : null

    const message =
      isProduction && status >= 500
        ? 'Internal server error'
        : typeof responseBody === 'object' && responseBody !== null
          ? (responseBody as Record<string, unknown>)['message'] ?? 'An error occurred'
          : responseBody ?? 'An error occurred'

    reply.status(status).send({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
