import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { Customer } from '../../../../domain/entities/customer.entity';
import { CustomerSchema } from '../../schemas';
import { CustomerMysqlRepository } from '../customer-mysql.repository';

test('customer repository', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [CustomerSchema],
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

  const customer = Customer.create({ name: 'Customer 1', cpf:'76552065035' });
  const customerRepo = new CustomerMysqlRepository(em);
  await customerRepo.add(customer);
  await em.flush();
  em.clear();

  let customerFound = await customerRepo.findById(customer.id);
  expect(customerFound.id.equals(customer.id)).toBeTruthy();
  expect(customerFound.name).toBe(customer.name);
  expect(customerFound.cpf.value).toBe('76552065035');

  customer.changeName('Customer 2');
  await customerRepo.add(customer);
  await em.flush();
  em.clear();

  customerFound = await customerRepo.findById(customer.id);
  expect(customerFound.id.equals(customer.id)).toBeTruthy();
  expect(customerFound.name).toBe(customer.name);

  customerRepo.delete(customer);
  await em.flush();

  await expect(customerRepo.findById(customer.id)).rejects.toThrow();

  await orm.close();
});
