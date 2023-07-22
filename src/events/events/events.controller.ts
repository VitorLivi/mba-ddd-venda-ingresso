import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from 'src/@core/events/application/event.service';
import { EventDto } from './event.dto';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) { }

  @Get()
  list() {
    return this.eventService.findEvents();
  }

  @Post()
  create(@Body() body: EventDto) {
    return this.eventService.create(body);
  }

  @Put(':event_id/publish-all')
  publish(@Param('event_id') event_id: string) {
    return this.eventService.publishAll({ event_id: event_id });
  }
}

const getSizeInBytes = (obj) => {
  let str = null;

  if (typeof obj === 'string') {
    str = obj;
  } else {
    str = JSON.stringify(obj);
  }

  const bytes = new TextEncoder().encode(str).length;
  return bytes;
}
