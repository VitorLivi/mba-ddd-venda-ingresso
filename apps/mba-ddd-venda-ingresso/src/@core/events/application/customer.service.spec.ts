import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { UnitOfWorkMikroOrm } from '../../@shared/infra/unit-of-work-mikro-orm';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerMysqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { CustomerSchema } from '../infra/db/schemas';
import { CustomerService } from './customer.service';

test('should list customers', async () => {
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
  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerRepo = new CustomerMysqlRepository(em);
  const customerService = new CustomerService(customerRepo, unitOfWork);

  const customer = Customer.create({
    name: 'Customer 1',
    cpf: '76552065035',
  });

  await customerRepo.add(customer);
  await em.flush();
  em.clear();

  const customers = await customerService.list();

  expect(customers).toHaveLength(1);
  expect(customers[0]).toBeInstanceOf(Customer);
  expect(customers[0].id).toBeDefined();
  expect(customers[0].name).toBe('Customer 1');
  expect(customers[0].cpf.value).toBe('76552065035');

  await orm.close();
});

test('should register a customer', async () => {
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

  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerRepo = new CustomerMysqlRepository(em);
  const customerService = new CustomerService(customerRepo, unitOfWork);

  const customer = await customerService.register({
    name: 'Customer 1',
    cpf: '76552065035',
  });

  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.name).toBe('Customer 1');
  expect(customer.cpf.value).toBe('76552065035');

  em.clear();

  const customerFound = await customerRepo.findById(customer.id);
  expect(customerFound).toBeInstanceOf(Customer);
  expect(customerFound.id).toBeDefined();
  expect(customerFound.name).toBe('Customer 1');
  expect(customerFound.cpf.value).toBe('76552065035');

  await orm.close();
});
