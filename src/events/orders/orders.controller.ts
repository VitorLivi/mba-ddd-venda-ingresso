import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from 'src/@core/events/application/order.service';

@Controller('events/:event_id/orders')
export class OrdersController {
  constructor(private orderService: OrderService) { }

  @Get()
  list() {
    return this.orderService.list();
  }

  @Post()
  create(
    @Param('event_id') event_id: string,
    @Body()
    body: {
      customer_id: string;
      section_id: string;
      spot_id: string;
      card_token: string;
    },
  ) {
    return this.orderService.create({
      card_token: body.card_token,
      customer_id: body.customer_id,
      event_id: event_id,
      section_id: body.section_id,
      spot_id: body.spot_id,
    });
  }
}
