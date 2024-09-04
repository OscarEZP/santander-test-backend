import { Injectable, BadRequestException, InternalServerErrorException, Inject, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from '../../employees/dto/create-employee.dto';
import { FileProcessingService } from '../file-processing/file-processing.service';
import { EmployeeEntity } from '../../entities/employee.entity';
import { Repository } from 'typeorm';
import { FileProcessingException } from '../../components/exceptions/file-processing.exception';

@Injectable()
export class EmployeeService {

  constructor(
    private readonly fileProcessingService: FileProcessingService,
    @Inject('EMPLOYEE_REPOSITORY')
    private employeeRepository: Repository<EmployeeEntity>
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto, file: Express.Multer.File) {
    try {
      const fileData = await this.fileProcessingService.processFile(file);
      const newEmployee = this.employeeRepository.create({
        ...createEmployeeDto,
        seniority: fileData.seniority,
        years: fileData.years,
        availability: String(fileData.availability).toLowerCase() === 'true',
      });
  
      return this.employeeRepository.save(newEmployee);
    } catch (error) {
      throw new FileProcessingException(error.message);
    }
  }

  findAll(): Promise<EmployeeEntity[]> {
    try {
      return this.employeeRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve employees.');
    }
  }

  async findOne(id: number): Promise<EmployeeEntity> {
    const employee = await this.employeeRepository.findOne({
      where: { id }
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async remove(id: number): Promise<void> {
    const result = await this.employeeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }
}
