import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common'
import { BalanceService } from './balance.service'
import { Balance as BalanceModel } from '@prisma/client'
import { CreateBalanceDto } from '@src/balance/dto/create-balance.dto'
import { Response } from 'express'

@Controller('balance')
export class BalanceController {
  constructor(readonly balanceService: BalanceService) {}

  @Post()
  create(@Body() createBalanceDto: CreateBalanceDto): Promise<BalanceModel> {
    const { amount, account_id } = createBalanceDto

    return this.balanceService.create({
      amount: Number(amount),
      account: {
        connect: {
          id: Number(account_id)
        }
      }
    })
  }

  @Get()
  findOne(
    @Query('account_id') accountId: number,
    @Res() response: Response
  ): Promise<Response<number>> {
    return this.balanceService.getBalance(accountId, response)
  }
}
