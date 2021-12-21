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

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(@Query() qeuryDto: QueryDto): Promise<Pagination<Order>> {
    return this.ordersService.findAll(qeuryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

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
