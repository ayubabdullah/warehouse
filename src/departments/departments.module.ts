import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { Department } from './entities/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { ItemsModule } from 'src/items/items.module';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Department]),EmployeesModule, ItemsModule, LogsModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
