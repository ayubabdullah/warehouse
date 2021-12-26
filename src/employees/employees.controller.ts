import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Employee } from './entities/employee.entity';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@Roles(Role.ADMIN)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll(@Query() qeuryDto: QueryDto): Promise<Pagination<Employee>> {
    return this.employeesService.findAll(qeuryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }
}
