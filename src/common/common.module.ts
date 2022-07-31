import { Module } from '@nestjs/common'
import { CommonController } from './common.controller'
import { CommonService } from './common.service'
import { PrismaService } from '@src/prisma/prisma.service'

@Module({
  imports: [],
  controllers: [CommonController],
  providers: [CommonService, PrismaService]
})
export class CommonModule {}
