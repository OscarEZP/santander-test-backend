import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { EmployeeService } from '../services/employees/employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileProcessingException } from 'src/components/exceptions/file-processing.exception';

@Controller('employee')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createEmployeeDto: CreateEmployeeDto) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }
    try {
      return await this.employeesService.create(createEmployeeDto, file);
    } catch (error) {
      if (error instanceof FileProcessingException) {
        throw new FileProcessingException(error.message);
      }
      throw new InternalServerErrorException('Failed to process the request.');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.employeesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve employees.');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.employeesService.findOne(+id);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to retrieve employee with ID ${id}.`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.employeesService.remove(+id);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete employee with ID ${id}.`);
    }
  }
}
