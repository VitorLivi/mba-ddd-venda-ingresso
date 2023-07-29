import { AggregateRoot } from '../../../@shared/domain/aggregate-root';
import { IDomainEvent } from '../../../@shared/domain/domain-event';
import { Uuid } from '../../../@shared/domain/value-objects/uuid.vo';

export class StoredEventId extends Uuid {}

export type StoredEventConstructorProps = {
  body: string;
  occured_on: Date;
  type_name: string;
};

export type StoredEventCommand = {
  domain_event: IDomainEvent;
  occured_on: Date;
};

export class StoredEvent extends AggregateRoot {
  id: StoredEventId;
  body: string;
  occured_on: Date;
  type_name: string;

  constructor(props: StoredEventConstructorProps, id?: StoredEventId) {
    super();
    this.id = id ?? new StoredEventId();
    this.body = props.body;
    this.occured_on = props.occured_on;
    this.type_name = props.type_name;
  }

  static create(domainEvent: IDomainEvent) {
    return new StoredEvent({
      body: JSON.stringify(domainEvent),
      occured_on: domainEvent.occurred_on,
      type_name: domainEvent.constructor.name,
    });
  }

  toJSON() {
    id: this.id.value;
    body: this.body;
    occured_on: this.occured_on;
  }
}
