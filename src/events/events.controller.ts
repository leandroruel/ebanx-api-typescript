import { Body, Controller, Post, Res } from '@nestjs/common'
import { Event } from '@src/interfaces'
import { Response } from 'express'
import { EventService } from './events.service'

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post()
  sendEvent(@Res() response: Response, @Body() data: Event) {
    this.eventService.accountEvent(response, data)
  }
}
