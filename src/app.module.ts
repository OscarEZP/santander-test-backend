import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { FileProcessingService } from './services/file-processing/file-processing.service';

@Module({
  imports: [EmployeesModule],
  controllers: [AppController],
  providers: [AppService, FileProcessingService],
})
export class AppModule {}
