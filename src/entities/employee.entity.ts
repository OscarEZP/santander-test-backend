import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  seniority: string;

  @Column('int')
  years: number;

  @Column()
  availability: boolean;
}