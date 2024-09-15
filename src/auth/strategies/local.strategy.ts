import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
      super({
        usernameField: 'email'
      });
    }
  
    async validate(email: string, password: string): Promise<any> {
      
      const user = await this.authService.validate(email, password);
      return user;
    }
  }