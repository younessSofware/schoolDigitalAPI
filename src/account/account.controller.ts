import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { Response } from 'src/common/Response';
import { CreateAccountRequestDto } from './dtos/create-account.dto';
import { instanceToPlain } from 'class-transformer';
import { UpdateAccountRequestDto } from './dtos/update-account.dto';
import { AccountState } from 'src/common/enum/account-state.enum';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/getAll')
  async findAll() {
    return Response.success(
      instanceToPlain(await this.accountService.findAdmin()),
      'retreive admin avec success',
    );
  }

  @Get('/:id')
  async findOneById(@Param('id') id: number) {
    const plainUser = instanceToPlain(await this.accountService.findOneById(id));
    return Response.success(
      plainUser,
      'retreive admin avec success',
    );
  }

  @Get('/findOneByEmail')
  async findOneByEmail(@Query('email') email: string) {
    return Response.success(
       instanceToPlain(await this.accountService.findOneByEmail(email)),
      'retreive admin avec success',
    );
  }

  @Post('/createAdmin')
  async createAdmin(@Body() request: CreateAccountRequestDto) {
    return Response.success(
      instanceToPlain(await this.accountService.createAdmin(request)),
      'create admin avec success',
    );
  }

  @Post('/:id/updateAdmin')
  async updateAdmin(
    @Param('id') id: number,
    @Body() request: UpdateAccountRequestDto,
  ) {
    return Response.success(
      instanceToPlain(await this.accountService.updateAdmin(id, request)),
      'update admin avec success',
    );
  }

  @Post('/:id/updateState')
  async updateState(
    @Param('id') id: number,
    @Query('state') state: AccountState,
  ) {
    return Response.success(
      instanceToPlain(await this.accountService.updateState(id, state)),
      'update state of an admin avec success',
    );
  }

  @Get('/:id/deleteAdmin')
  async deleteAdmin(
    @Param('id') id: number,
  ) {
    return Response.success(
      await this.accountService.deleteAdmin(id),
      'delete admin avec success',
    );
  }
}
