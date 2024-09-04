import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeeService } from '../services/employees/employees.service';
import { FileProcessingService } from '../services/file-processing/file-processing.service';
import { employeeProviders } from '../entities/employee.providers';
import { DatabaseModule } from 'src/config/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeesController],
  providers: [
    EmployeeService,
    FileProcessingService,
    ...employeeProviders]
})
export class EmployeesModule {}
