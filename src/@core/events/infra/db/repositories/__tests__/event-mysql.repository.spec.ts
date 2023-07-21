import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { Partner } from '../../../../domain/entities/partner.entity';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
} from '../../schemas';
import { EventMysqlRepository } from '../event-mysql.repository';
import { PartnerMysqlRepository } from '../partner-mysql.repository';

test('event repository', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [EventSchema, EventSectionSchema, EventSpotSchema, PartnerSchema],
    dbName: 'events',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    type: 'mysql',
    forceEntityConstructor: true,
  });

  await orm.schema.refreshDatabase();
  const em = orm.em.fork();

  const partnerRepo = new PartnerMysqlRepository(em);
  const eventRepo = new EventMysqlRepository(em);

  const partner = Partner.create({ name: 'Partner 1' });
  await partnerRepo.add(partner);
  const event = partner.initEvent({
    name: 'Event 1',
    date: new Date(),
    description: 'Description 1',
  });

  event.addSection({
    name: 'Section 1',
    description: 'Description 1',
    price: 100,
    total_spots: 1000,
  });

  eventRepo.add(event);
  await em.flush();
  em.clear();

  const eventFound = await eventRepo.findById(event.id);
  expect(eventFound).not.toBeNull();

  await orm.close();
});
