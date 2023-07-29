import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { Partner } from '../../domain/entities/partner.entity';
import { PartnerSchema } from './schemas';

test('should create a partner', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [PartnerSchema],
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
  const partner = Partner.create({ name: 'Partner 1' });

  await em.persistAndFlush(partner);
  em.clear();
});
