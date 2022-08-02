import { Module } from '@nestjs/common'
import { PrismaService } from '@src/prisma/prisma.service'
import { EventController } from './events.controller'
import { EventService } from './events.service'
import { AccountsService } from '@src/accounts/accounts.service'

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService, AccountsService]
})
export class EventModule {}
