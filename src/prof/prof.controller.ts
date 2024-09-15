import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ProfService } from './prof.service';
import { ProfCreateDto } from './prof.create-dto';

@Controller('teachers')
export class ProfController {
  constructor(private profService: ProfService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('sortField') sortField: string,
    @Query('sortDirection') sortDirection: number,
  ) {
    return this.profService.getAll(
      skip ? skip : 0,
      take ? take : 5,
      sortField,
      sortDirection,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async persistProf(@Body() prof: ProfCreateDto) {
    return this.profService.createProf(prof);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProf(@Param('id') id: number) {
    return this.profService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/update')
  update(@Param('id') id: number, @Body() prof: ProfCreateDto) {
    return this.profService.update(id, prof);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get('/:id/delete')
  async deleteProf(@Param('id') id: number) {
    return this.profService.delete(id);
  }

  
}
