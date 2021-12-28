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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Order } from './entities/order.entity';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto';
import { UpdateOrderItemDto } from 'src/order-items/dto/update-order-item.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() qeuryDto: QueryDto): Promise<Pagination<Order>> {
    return this.ordersService.findAll(qeuryDto);
  }
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  // OrderItem Controllers
  @Post(':orderId/orderitems')
  createOrderItem(
    @Param('orderId') orderId: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    return this.orderItemsService.create(+orderId, createOrderItemDto);
  }

  @Patch(':orderId/orderitems/:id')
  updateOrderItem(
    @Param('orderId') orderId: string,
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(+orderId, +id, updateOrderItemDto);
  }

  @Delete(':orderId/orderitems/:id')
  removeOrderItem(@Param('orderId') orderId: string, @Param('id') id: string) {
    return this.orderItemsService.remove(+orderId, +id);
  }
}
