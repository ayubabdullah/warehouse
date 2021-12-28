import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { Role } from 'src/common/enums/role.enum';
import { CreateItemDto } from 'src/items/dtos/create-item.dto';
import { UpdateItemDto } from 'src/items/dtos/update-item.dto';
import { ItemsService } from 'src/items/items.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { UpdateOrderDto } from 'src/orders/dto/update-order.dto';
import { OrdersService } from 'src/orders/orders.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly itemsService: ItemsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  // Department Controllers
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() qeuryDto: QueryDto): Promise<Pagination<Department>> {
    return this.departmentsService.findAll(qeuryDto);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(+id, updateDepartmentDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }

  // Item Controllers
  @Get(':departmentId/items')
  getAllItems(
    @Param('departmentId') departmentId: string,
    @Query() queryDto: QueryDto,
  ) {
    return this.itemsService.findDepartmentItems(+departmentId, queryDto);
  }
  @Get(':departmentId/items/:id')
  getItem(
    @Param('departmentId') departmentId: string,
    @Param('id') id: string,
  ) {
    return this.itemsService.findDepartmentItem(+departmentId, +id);
  }

  @Post(':departmentId/items')
  createItem(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.itemsService.create(+departmentId, user, createItemDto);
  }
  @Patch(':departmentId/items/:id')
  updateItem(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateItemDto,
  ) {
    return this.itemsService.update(+departmentId, user, +id, body);
  }
  @Delete(':departmentId/items/:id')
  removeItem(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Param('id') id: string,
  ) {
    return this.itemsService.removeDepartmentItem(+departmentId, user, +id);
  }

  // Order Controllers
  @Get(':departmentId/orders')
  getAllOrders(
    @Param('departmentId') departmentId: string,
    @Query() queryDto: QueryDto,
  ) {
    return this.ordersService.findDepartmentOrders(+departmentId, queryDto);
  }
  @Get(':departmentId/orders/:id')
  getOrder(
    @Param('departmentId') departmentId: string,
    @Param('id') id: string,
  ) {
    return this.ordersService.findDepartmentOrder(+departmentId, +id);
  }

  @Post(':departmentId/orders')
  createOrder(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(+departmentId, user, createOrderDto);
  }
  @Patch(':departmentId/orders/:id')
  updateOrder(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateOrderDto,
  ) {
    return this.ordersService.update(+departmentId, user, +id, body);
  }
  @Delete(':departmentId/orders/:id')
  removeOrder(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Param('id') id: string,
  ) {
    return this.ordersService.removeDepartmentOrder(+departmentId, user, +id);
  }

  // User Controllers
  @Roles(Role.ADMIN, Role.STORE_MANAGER)
  @Get(':departmentId/users')
  getAllUsers(
    @Param('departmentId') departmentId: string,
    @Query() queryDto: QueryDto,
  ) {
    return this.usersService.findDepartmentUsers(+departmentId, queryDto);
  }
  @Roles(Role.ADMIN, Role.STORE_MANAGER)
  @Get(':departmentId/users/:id')
  getUser(
    @Param('departmentId') departmentId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.findDepartmentUser(+departmentId, +id);
  }
}
