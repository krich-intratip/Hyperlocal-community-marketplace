import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class LangInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string>; lang?: string }>()
    const acceptLang = request.headers['accept-language'] ?? 'th'
    // Parse first lang code (e.g. 'th', 'en-US' → 'en')
    const lang = acceptLang.split(',')[0]?.split('-')[0]?.trim() ?? 'th'
    request.lang = ['th', 'en'].includes(lang) ? lang : 'th'
    return next.handle()
  }
}
