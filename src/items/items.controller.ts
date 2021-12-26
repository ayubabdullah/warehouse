import { Controller, Get, Param, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from 'src/common/decorators/role.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { Role } from 'src/common/enums/role.enum';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@Roles(Role.ADMIN)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(@Query() qeuryDto: QueryDto): Promise<Pagination<Item>> {
    return this.itemsService.findAll(qeuryDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }
}
