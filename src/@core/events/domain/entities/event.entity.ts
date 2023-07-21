import { AggregateRoot } from '../../../@shared/domain/aggregate-root';
import { Uuid } from '../../../@shared/domain/value-objects/uuid.vo';
import { AnyCollection, ICollection, MyCollectionFactory } from '../my-collection';
import { EventSection } from './event-section.entity';
import { PartnerId } from './partner.entity';

export class EventId extends Uuid {}

export interface CreateEventCommand {
  name: string;
  description?: string | null;
  date: Date;
  partner_id: PartnerId;
}

export interface AddSectionCommand {
  name: string;
  description?: string | null;
  total_spots: number;
  price: number;
}

export interface EventConstructorProps {
  id?: EventId | string;
  name: string;
  description: string | null;
  date: Date;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  partner_id: PartnerId | string;
}

export class Event extends AggregateRoot {
  id: EventId;
  name: string;
  description: string | null;
  date: Date;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  partner_id: PartnerId;
  private _sections: ICollection<EventSection>;

  constructor(props: EventConstructorProps) {
    super();

    this.id = props.id ? (props.id instanceof EventId ? props.id : new EventId(props.id)) : new EventId();

    this.name = props.name;
    this.description = props.description;
    this.date = props.date;
    this.is_published = props.is_published;
    this.total_spots = props.total_spots;
    this.total_spots_reserved = props.total_spots_reserved;
    this.partner_id = props.partner_id instanceof PartnerId ? props.partner_id : new PartnerId(props.partner_id);
    this._sections = MyCollectionFactory.create<EventSection>(this);
  }

  static create(command: CreateEventCommand): Event {
    const event = new Event({
      ...command,
      description: command.description || null,
      is_published: false,
      total_spots: 0,
      total_spots_reserved: 0,
    });

    return event;
  }

  changeName(name: string): void {
    this.name = name;
  }

  changeDescription(description: string | null): void {
    this.description = description;
  }

  changeDate(date: Date): void {
    this.date = date;
  }

  publishAll(): void {
    this.publish();
    this._sections.forEach((section) => section.publishAll());
  }

  unPublishAll(): void {
    this.unPublish();
    this._sections.forEach((section) => section.unPublishAll());
  }

  publish(): void {
    this.is_published = true;
  }

  unPublish(): void {
    this.is_published = false;
  }

  addSection(command: AddSectionCommand) {
    const section = EventSection.create(command);
    this._sections.add(section);
    this.total_spots += section.total_spots;
  }

  get sections(): ICollection<EventSection> {
    return this._sections as ICollection<EventSection>;
  }

  set sections(sections: AnyCollection<EventSection>) {
    this._sections = MyCollectionFactory.createFrom<EventSection>(sections);
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      date: this.date,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      partner_id: this.partner_id.value,
      sections: [...this._sections].map((section) => section.toJSON()),
    };
  }
}
