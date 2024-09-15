import { I18nService } from 'nestjs-i18n';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { log, Logger } from 'winston';

@Catch(HttpException)
export class ResponseExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18n: I18nService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const r = <any>exception.getResponse();

    this.logger.error(exception);

    if (typeof r.message == 'string') {
      r.message = await this.i18n.translate(r.message);
    } else if (status == 400) {
      
      r.message = await this.formatMessagesAdvanced(r.message);
    }

    response.status(status).send(r);
  }

  async formatMessagesAdvanced(messages: string[]): Promise<Record<string, string[]>> {
    const accumulator: Record<string, string[]> = {};
  
    // Use a Map to collect and aggregate translations by key
    const translationMap = new Map<string, string[]>();
  
    for (const message of messages) {
      const [key, value] = message.split(':');
      if (key && value) {
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
  
        // Translate the value asynchronously
        const translatedValue = await this.translateAdvanced(trimmedKey, trimmedValue);
  
        // Update the translationMap with the translated value
        if (!translationMap.has(trimmedKey)) {
          translationMap.set(trimmedKey, []);
        }
        translationMap.get(trimmedKey)!.push(translatedValue);
      }
    }
  
    // Convert the Map to a plain object
    for (const [key, values] of translationMap) {
      accumulator[key] = values;
    }
  
    return accumulator;
  }

  async translateAdvanced(key: string, value: string): Promise<string> {
    // Perform the translation (assumed to be correct implementation)

    const translatedProperty = (await this.i18n.translate(
      'errors.' + key,
      {},
    )) as string;

    const response = (await this.i18n.translate(
      'errors.' + value.split('.')[0],
      {
        args: {
          property: translatedProperty,
          length: value.split('.').length
            ? value.split('.')[value.split('.').length - 1]
            : NaN,
        },
      },
    )) as string;

    return response;
  }
}
