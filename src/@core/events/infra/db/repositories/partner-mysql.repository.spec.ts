import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { Partner } from '../../../domain/entities/partner.entity';
import { PartnerSchema } from '../schemas';
import { PartnerMysqlRepository } from './partner-mysql.repository';

test('partner repository', async () => {
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
  const partnerRepo = new PartnerMysqlRepository(em);
  await partnerRepo.add(partner);
  await em.flush();
  em.clear();

  let partnerFound = await partnerRepo.findById(partner.id);
  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);

  partner.changeName('Partner 2');
  await partnerRepo.add(partner);
  await em.flush();
  em.clear();

  partnerFound = await partnerRepo.findById(partner.id);
  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);

  partnerRepo.delete(partner);
  await em.flush();

  await expect(partnerRepo.findById(partner.id)).rejects.toThrow();

  await orm.close();
});
