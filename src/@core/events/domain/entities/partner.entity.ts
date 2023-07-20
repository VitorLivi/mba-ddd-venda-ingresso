import { AggregateRoot } from '../../../@shared/domain/aggregate-root';
import { Uuid } from '../../../@shared/domain/value-objects/uuid.vo';
import { Event } from './event.entity';

export class PartnerId extends Uuid {}

export interface InitEventCommand {
  name: string;
  description?: string | null;
  date: Date;
}

export type PartnerConstructorProps = {
  id?: PartnerId | string;
  name: string;
};

export class Partner extends AggregateRoot {
  readonly id: PartnerId;
  name: string;

  constructor(props: PartnerConstructorProps) {
    super();

    this.id = props.id ? (props.id instanceof PartnerId ? props.id : new PartnerId(props.id)) : new PartnerId();
    this.name = props.name;
  }

  static create(command: { name: string }): Partner {
    return new Partner({
      name: command.name,
    });
  }

  initEvent(command: InitEventCommand): Event {
    return Event.create({
      ...command,
      partner_id: this.id,
    });
  }

  changeName(name: string): void {
    this.name = name;
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
    };
  }
}
