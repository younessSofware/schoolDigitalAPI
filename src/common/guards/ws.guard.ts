import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { Helper } from './../helpers';
import { Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class WsGuard implements CanActivate {

  @WebSocketServer()
  server: Server

  constructor(private helper: Helper) { }

  async canActivate(context: any): Promise<boolean> {

    const token = context.args[0].handshake.auth.token;

    try {
      const account = await this.helper.extractAuthenticatedAccount(token);

      context.switchToHttp().getRequest().user = account;

      return !!account;
    } catch (error) {
      const sockets = context.args[0].client.sockets;
      const server: Server = context.args[0].server
      server.to([...sockets.keys()][0]).emit('error', error);
    }

  }
}
