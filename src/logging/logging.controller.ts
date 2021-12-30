import { Controller, Get, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from 'src/common/decorators/role.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { Role } from 'src/common/enums/role.enum';
import { Log } from './entities/log.entity';
import { LogsService } from './logging.service';
@Roles(Role.ADMIN)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async findAll(@Query() qeuryDto: QueryDto): Promise<Pagination<Log>> {
    return this.logsService.findAll(qeuryDto);
  }
}
