import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Helper } from '../helpers';
import { AccountEntity } from 'src/account/account.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {

      
      if(!user){
        throw new UnauthorizedException('errors.authenticated_not_found');
      }
      
      user = await Helper.dataSource.getRepository(AccountEntity).findOne({
        select: ['id', 'fullname', 'email', 'role'],
        where: {id: user.userId}
      })
      
      if(!user){
        throw new UnauthorizedException('errors.authenticated_not_found');
      }
      
      return user
    }
}
