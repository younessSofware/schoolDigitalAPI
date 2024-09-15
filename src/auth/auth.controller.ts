import { Response } from 'src/common/Response';
import { AuthService } from './auth.service';
import { Controller, Post, Body } from '@nestjs/common';
import { CreateAccountRequestDto } from 'src/account/dtos/create-account.dto';

@Controller('auth/')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('login')
    async login(@Body() request){
        return Response.success(await this.authService.login(request), "Login success");
    }
    
    
    @Post('auth')
    // @UseGuards(LocalAuthGuard, RolesGuard(AccountRole.ADMIN))
    async loginAdmin(@Body() request){
        return Response.success(await this.authService.login(request, true), "Login success");
        // return Response.success(this.authService.loginAdmin(req.user), "Login success");
    }


//     @Post('register')
//     // @UseGuards(LocalAuthGuard, RolesGuard(AccountRole.ADMIN))
//     async register(@Body() request: CreateAccountRequestDto){
//         return Response.success(await this.authService.register(request), "Create account with success");
//         // return Response.success(this.authService.loginAdmin(req.user), "Login success");
//     }
}
