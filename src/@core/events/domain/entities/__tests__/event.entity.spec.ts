import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { EventSection } from '../event-section.entity';
import { Event } from '../event.entity';
import { PartnerId } from '../partner.entity';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
} from '../../../infra/db/schemas';

test('should create a event', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [EventSchema, EventSectionSchema, EventSpotSchema],
    dbName: 'events',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    type: 'mysql',
    forceEntityConstructor: true,
  });

  const event = Event.create({
    name: 'Event name',
    description: 'Event description',
    date: new Date(),
    partner_id: new PartnerId(),
  });

  const eventSection = EventSection.create({
    name: 'Section name',
    description: 'Section description',
    total_spots: 100,
    price: 1000,
  });

  event.addSection({
    name: 'Section name',
    description: 'Section description',
    total_spots: 100,
    price: 1000,
  });

  expect(event.sections[0]).toBeInstanceOf(EventSection);
  expect(event.total_spots).toBe(100);

  let spotNumber = 0;
  eventSection.spots.forEach(() => spotNumber++);

  expect(spotNumber).toBe(100);

  const [section] = event.sections;
  expect(section.spots.count()).toBe(100);
});

test('should publish all event items', () => {
  const event = Event.create({
    name: 'Event name',
    description: 'Event description',
    date: new Date(),
    partner_id: new PartnerId(),
  });

  event.addSection({
    name: 'Section name',
    description: 'Section description',
    total_spots: 100,
    price: 1000,
  });
  event.addSection({
    name: 'Section name 2',
    description: 'Section description 2',
    total_spots: 1000,
    price: 50,
  });

  event.publishAll();
  expect(event.is_published).toBe(true);

  const [section1, section2] = event.sections.getItems();
  expect(section1.is_published).toBe(true);
  expect(section2.is_published).toBe(true);

  [...section1.spots, ...section2.spots].forEach((spot) => {
    expect(spot.is_published).toBe(true);
  });
});

test('should unpublish all event items', () => {
  const event = Event.create({
    name: 'Event name',
    description: 'Event description',
    date: new Date(),
    partner_id: new PartnerId(),
  });

  event.addSection({
    name: 'Section name',
    description: 'Section description',
    total_spots: 100,
    price: 1000,
  });
  event.addSection({
    name: 'Section name 2',
    description: 'Section description 2',
    total_spots: 1000,
    price: 50,
  });

  event.publishAll();
  event.unPublishAll();
  expect(event.is_published).toBe(false);

  const [section1, section2] = event.sections.getItems();
  expect(section1.is_published).toBe(false);
  expect(section2.is_published).toBe(false);

  [...section1.spots, ...section2.spots].forEach((spot) => {
    expect(spot.is_published).toBe(false);
  });
});
