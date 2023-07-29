import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { IIntegrationEvent } from '../@core/@shared/domain/integration-event';

@Processor('integration-events')
export class IntegrationEventsPublisher {
  constructor(private amqpConnection: AmqpConnection) { }

  @Process()
  async handle(job: Job<IIntegrationEvent>) {
    await this.amqpConnection.publish(
      'amq.direct',
      job.data.event_name,
      job.data,
    );

    return {};
  }
}
