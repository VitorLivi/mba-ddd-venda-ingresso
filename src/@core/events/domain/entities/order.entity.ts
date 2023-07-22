import { AggregateRoot } from '../../../@shared/domain/aggregate-root';
import { Uuid } from '../../../@shared/domain/value-objects/uuid.vo';
import { CustomerId } from './customer.entity';
import { EventSpotId } from './event-spot.entity';

export enum OrderStatus {
  PENDING,
  PAID,
  CANCELLED,
}

export class OrderId extends Uuid {}

export type OrderConstructorProps = {
  id?: OrderId | string;
  customer_id: CustomerId;
  amount: number;
  event_spot_id: EventSpotId;
};

export class Order extends AggregateRoot {
  id: OrderId;
  customer_id: CustomerId;
  amount: number;
  event_spot_id: EventSpotId;
  status: OrderStatus = OrderStatus.PENDING;

  constructor(props: OrderConstructorProps) {
    super();

    this.id = props.id ? (props.id instanceof OrderId ? props.id : new OrderId(props.id)) : new OrderId();
    this.amount = props.amount;
    this.customer_id = props.customer_id instanceof CustomerId ? props.customer_id : new CustomerId(props.customer_id);
    this.event_spot_id = props.event_spot_id instanceof EventSpotId ? props.event_spot_id : new EventSpotId(props.event_spot_id);
  }

  static create(props: OrderConstructorProps): Order {
    return new Order(props);
  }

  pay(): void {
    this.status = OrderStatus.PAID;
  }

  cancel(): void {
    this.status = OrderStatus.CANCELLED;
  }

  toJSON() {
    return {
      id: this.id.value,
      amount: this.amount,
      customer_id: this.customer_id.value,
      event_spot_id: this.event_spot_id.value,
    };
  }
}
