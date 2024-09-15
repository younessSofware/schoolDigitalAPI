import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateStudentRequestDto } from './dtos/student-create.dto';

@Controller('students')
export class StudentController {

    constructor(private studentService: StudentService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(
      @Query('skip') skip: number,
      @Query('take') take: number,
      @Query('sortField') sortField: string,
      @Query('sortDirection') sortDirection: number,
    ) {
      return this.studentService.getAll(
        skip ? skip : 0,
        take ? take : 5,
        sortField,
        sortDirection,
      );
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async persistProf(@Body() student: CreateStudentRequestDto) {
      return this.studentService.create(student);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getProf(@Param('id') id: number) {
      return this.studentService.getOne(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('/:id/update')
    update(@Param('id') id: number, @Body() prof: CreateStudentRequestDto) {
      return this.studentService.update(id, prof);
    }
  
    
    @UseGuards(JwtAuthGuard)
    @Get('/:id/delete')
    async deleteProf(@Param('id') id: number) {
      return this.studentService.delete(id);
    }
}
