import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsumerService {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'PartnerCreatedIntegrationEvent',
    queue: 'emails',
  })
  handle(message: { event_name: string; [key: string]: any }) {
    console.log('ConsumerService: ', message);
  }
}
