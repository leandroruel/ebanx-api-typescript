import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AccountsModule } from './accounts/accounts.module'
import { AppService } from './app.service'
import { PrismaModule } from '@src/prisma/prisma.module'
import { CommonModule } from '@src/common/common.module'
import { EventModule } from '@src/events/events.module'

@Module({
  imports: [PrismaModule, AccountsModule, CommonModule, EventModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
