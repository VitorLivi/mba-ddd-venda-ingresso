import { Entity } from '../../../../@core/@shared/domain/entity';
import { Uuid } from '../../../@shared/domain/value-objects/uuid.vo';
import {
  AnyCollection,
  ICollection,
  MyCollectionFactory,
} from '../my-collection';
import { EventSpot } from './event-spot.entity';

export class EventSectionId extends Uuid {}

export interface CreateEventSectionCommand {
  name: string;
  description?: string | null;
  total_spots: number;
  price: number;
}

export interface EventSectionConstructorProps {
  id?: EventSectionId | string;
  name: string;
  description: string | null;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
}

export class EventSection extends Entity {
  id: EventSectionId;
  name: string;
  description: string | null;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
  private _spots: ICollection<EventSpot>;

  constructor(props: EventSectionConstructorProps) {
    super();

    this.id = props.id ? (props.id instanceof EventSectionId ? props.id : new EventSectionId(props.id)) : new EventSectionId();
    this.name = props.name;
    this.description = props.description;
    this.is_published = props.is_published;
    this.total_spots = props.total_spots;
    this.total_spots_reserved = props.total_spots_reserved;
    this.price = props.price;
    this._spots = MyCollectionFactory.create<EventSpot>(this);
  }

  static create(command: CreateEventSectionCommand): EventSection {
    const eventSection = new EventSection({
      ...command,
      description: command.description ?? null,
      is_published: false,
      total_spots_reserved: 0,
    });

    eventSection.initSpots();
    return eventSection;
  }

  private initSpots() {
    for(let i = 0; i < this.total_spots; i++) {
      this._spots.add(EventSpot.create());
    }
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string | null) {
    this.description = description;
  }

  changePrice(price: number) {
    this.price = price;
  }

  publishAll(): void {
    this.publish();
    this._spots.forEach((spot) => spot.publish());
  }

  unPublishAll(): void {
    this.unPublish();
    this._spots.forEach((spot) => spot.unPublish());
  }

  publish(): void {
    this.is_published = true;
  }

  unPublish(): void {
    this.is_published = false;
  }

  get spots(): ICollection<EventSpot> {
    return this._spots as ICollection<EventSpot>;
  }

  set spots(spots: AnyCollection<EventSpot>) {
    this._spots = MyCollectionFactory.createFrom<EventSpot>(spots);
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      price: this.price,
      spots: [...this._spots].map((spot) => spot.toJSON()),
    };
  }
}
