import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { AccountRole } from 'src/common/enum/account-role.enum';
import { AccountState } from 'src/common/enum/account-state.enum';
import { AccountEntity } from 'src/account/account.entity';
import { AccountService } from 'src/account/account.service';
import { NOT_VERIFIED_ACCOUNT_CODE } from 'src/common/constants';
import { JWT_SECRET } from 'src/config/typeorm.config';

@Injectable()
export class AuthService {

    constructor(
        private readonly accountService: AccountService, 
        private readonly jwtService: JwtService, 
        private readonly i18n: I18nService,
        private configService: ConfigService
    ){}

    async validate(email: string, password: string){

        if(!email) throw new BadRequestException('email is required')
        if(!password) throw new BadRequestException('password is required')
        
        let account: AccountEntity;
        if(email) account = await this.accountService.findOneByEmail(email);
        
        if(!account){
            throw new BadRequestException('errors.bad_credentials')
        }
        
        if(account.state == AccountState.BLOCKED) throw new ForbiddenException('errors.account_blocked')
        if(account.state == AccountState.SUSPENDED) throw new ForbiddenException('errors.account_account_suspended')

        console.log('password', account.password);
        console.log('salt', account.password);
        console.log('password', password);
        console.log('password', bcrypt.hashSync(password, account.salt));
        

        if(account.password != bcrypt.hashSync(password, account.salt)){
            throw new BadRequestException('errors.bad_credentials')
        }
        
        if(account.role == 'admin') return account;
        
        
        return account;
    }

    async login(request: any, onlyAdmin = false){

        const account = await this.validate(request.email, request.password)

        if(onlyAdmin && account.role != AccountRole.ADMIN) throw new NotFoundException("errors.not_allowed");

        const payload = {
            sub: account.id,
            email: account.email,
        }

        const res = {
            accessToken: this.jwtService.sign(payload, {
                secret: JWT_SECRET
            }),
            account: {
                id: account.id,
                name: account.fullname,
                email: account.email,
                role: account.role
            }
        };

        return res;
    }
    
    loginAdmin(account: AccountEntity){
        if(account.role == AccountRole.ADMIN) return this.login(account);
        throw new UnauthorizedException("cannot_login_to_space")
    }

    verifyToken(token: string){
        return this.jwtService.verify(token, {
            secret: JWT_SECRET
        });
    }

    decodeToken(token: string){
        return this.jwtService.decode(token);
    }

    // register(request: any){
    //     return this.accountService.create(request, AccountRole.CLIENT);
    // }


}
