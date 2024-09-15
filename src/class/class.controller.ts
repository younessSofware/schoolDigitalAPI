import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateClassRequestDto } from './dtos/create-class.dto';
import { Response } from 'src/common/Response';
import { ClassService } from './class.service';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('/create')
  async createClass(@Body() request: CreateClassRequestDto) {
    return Response.success(
      await this.classService.createClass(request),
      'create class avec success',
    );
  }

  @Post('/:id/update')
  async updateClass(
    @Param('id') id: number,
    @Body() request: CreateClassRequestDto,
  ) {
    return Response.success(
      await this.classService.updateClass(id, request),
      'update class avec success',
    );
  }

  @Get('/findAll')
  async getAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('sortField') sortField: string,
    @Query('sortDirection') sortDirection: number,
  ) {
    return this.classService.getAll(
      skip ? skip : 0,
      take ? take : 5,
      sortField,
      sortDirection,
    );
  }
}
