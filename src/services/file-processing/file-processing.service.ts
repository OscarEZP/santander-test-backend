import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as XLSX from 'xlsx';
import { FileProcessingException } from '../../components/exceptions/file-processing.exception';

@Injectable()
export class FileProcessingService {
  
  async processFile(file: Express.Multer.File): Promise<any> {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      return this.processCSV(file.path);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      return this.processExcel(file.path);
    } else {
      throw new FileProcessingException('Invalid file format. Only CSV and Excel files are supported.');
    }
  }

  private async processCSV(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          fs.unlinkSync(filePath);
          if (results.length !== 1) {
            return reject(new FileProcessingException('The file must contain exactly one row.'));
          }
          const row = results[0];
          this.validateRow(row);
          resolve(row);
        })
        .on('error', (error) => reject(new FileProcessingException('Error processing CSV file')));
    });
  }

  private async processExcel(filePath: string): Promise<any> {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    fs.unlinkSync(filePath);

    if (sheet.length !== 1) {
      throw new FileProcessingException('The file must contain exactly one row.');
    }

    const row = sheet[0];
    this.validateRow(row);
    return row;
  }

  private validateRow(row: any): void {
    if (!row.seniority || !row.years || row.availability === undefined) {
      throw new FileProcessingException('The file must contain the columns: seniority, years, availability.');
    }
  }
}
