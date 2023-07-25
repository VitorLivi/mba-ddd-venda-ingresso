import { MikroORM } from '@mikro-orm/mysql';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from 'src/@core/events/infra/db/schemas';

export function initOrm() {
  beforeAll(async () => {
    await MikroORM.init({
      allowGlobalContext: true,
      entities: [
        PartnerSchema,
        CustomerSchema,
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
        OrderSchema,
        SpotReservationSchema,
      ],
      type: 'mysql',
      dbName: 'fake',
    }, false);
  });
}
