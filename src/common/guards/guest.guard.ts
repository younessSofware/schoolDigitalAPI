import { Helper } from './../helpers';
import { Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class GuestGuard implements CanActivate {

  constructor(private helper: Helper) { }

  async canActivate(context: any): Promise<boolean> {

    try {
      if(context.args[0].headers.authorization){
        const token = context.args[0].headers.authorization.split('Bearer ')[1];
        const account = await this.helper.extractAuthenticatedAccount(token);
        context.switchToHttp().getRequest().user = account;
      }
    } catch (error) {
    }

    return true;
  }
}
