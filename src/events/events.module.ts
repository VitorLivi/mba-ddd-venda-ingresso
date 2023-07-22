import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import {
  CustomerSchema,
  PartnerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  SpotReservationSchema,
} from '../@core/events/infra/db/schemas';
import { PartnerMysqlRepository } from 'src/@core/events/infra/db/repositories/partner-mysql.repository';
import { EntityManager } from '@mikro-orm/mysql';
import { CustomerMysqlRepository } from 'src/@core/events/infra/db/repositories/customer-mysql.repository';
import { EventMysqlRepository } from 'src/@core/events/infra/db/repositories/event-mysql.repository';
import { OrderMysqlRepository } from 'src/@core/events/infra/db/repositories/order-mysql.repository';
import { SpotReservationMysqlRepository } from 'src/@core/events/infra/db/repositories/spot-reservation-mysql.repository';
import { PartnerService } from 'src/@core/events/application/partner.service';
import { CustomerService } from 'src/@core/events/application/customer.service';
import { EventService } from 'src/@core/events/application/event.service';
import { PaymentGateway } from 'src/@core/events/application/payment.gateway';
import { OrderService } from 'src/@core/events/application/order.service';
import { IPartnerRepository } from 'src/@core/events/domain/repositories/partner-repository.interface';
import { IUnitOfWork } from 'src/@core/@shared/application/unit-of-work.interface';
import { ICustomerRepository } from 'src/@core/events/domain/repositories/customer-repository.interface';
import { IEventRepository } from 'src/@core/events/domain/repositories/event-repository.interface';
import { IOrderRepository } from 'src/@core/events/domain/repositories/order-repository.interface';
import { ISpotReservationRepository } from 'src/@core/events/domain/repositories/spot-reservation-repository.interface';
import { PartnersController } from './partners/partners.controller';
import { CustomersController } from './customers/customers.controller';
import { EventsController } from './events/events.controller';
import { EventSectionController } from './events/events-sections.controller';
import { EventSpotsController } from './events/events-spots.controller';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CustomerSchema,
      PartnerSchema,
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema,
    ]),
  ],
  providers: [
    {
      provide: 'ICustomerRepository',
      useFactory: (em: EntityManager) => {
        return new CustomerMysqlRepository(em);
      },
      inject: [EntityManager],
    },
    {
      provide: 'IPartnerRepository',
      useFactory: (em: EntityManager) => {
        return new PartnerMysqlRepository(em);
      },
      inject: [EntityManager],
    },
    {
      provide: 'IEventRepository',
      useFactory: (em: EntityManager) => {
        return new EventMysqlRepository(em);
      },
      inject: [EntityManager],
    },
    {
      provide: 'IOrderRepository',
      useFactory: (em: EntityManager) => {
        return new OrderMysqlRepository(em);
      },
      inject: [EntityManager],
    },
    {
      provide: 'ISpotReservationRepository',
      useFactory: (em: EntityManager) => {
        return new SpotReservationMysqlRepository(em);
      },
      inject: [EntityManager],
    },
    {
      provide: PartnerService,
      useFactory: (partnerRepo: IPartnerRepository, uow: IUnitOfWork) => new PartnerService(partnerRepo, uow),
      inject: ['IPartnerRepository', 'IUnitOfWork'],
    },
    {
      provide: CustomerService,
      useFactory: (customerRepo: ICustomerRepository, uow: IUnitOfWork) => new CustomerService(customerRepo, uow),
      inject: ['ICustomerRepository', 'IUnitOfWork'],
    },
    {
      provide: EventService,
      useFactory: (
        eventRepo: IEventRepository,
        partnerRepo: IPartnerRepository,
        uow: IUnitOfWork,
      ) => new EventService(eventRepo, partnerRepo, uow),
      inject: ['IEventRepository', 'IPartnerRepository', 'IUnitOfWork'],
    },
    PaymentGateway,
    {
      provide: OrderService,
      useFactory: (
        orderRepo: IOrderRepository,
        customerRepo: ICustomerRepository,
        eventRepo: IEventRepository,
        spotReservationRepo: ISpotReservationRepository,
        uow: IUnitOfWork,
        paymentGateway: PaymentGateway,
      ) => {
        new OrderService(
          orderRepo,
          customerRepo,
          eventRepo,
          spotReservationRepo,
          uow,
          paymentGateway,
        );
      },
      inject: [
        'IOrderRepository',
        'ICustomerRepository',
        'IEventRepository',
        'ISpotReservationRepository',
        'IUnitOfWork',
        PaymentGateway,
      ],
    },
  ],
  controllers: [
    PartnersController,
    CustomersController,
    EventsController,
    EventSectionController,
    EventSpotsController,
    OrdersController,
  ],
})
export class EventsModule { }
