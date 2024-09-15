import { I18nContext, I18nService } from 'nestjs-i18n';
export class Response{
    
    static async success(data: any, message?: string, i18n?: I18nContext, entity?: string){
        message = i18n ? await i18n.translate(message, {args: {entity}}) : message;
    
        
        
        return {
            data,
            message,
        }
    }
}