import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  HttpStatus
} from '@nestjs/common'
import { Response } from 'express'
import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto)
  }

  @Get('balance')
  async getBy(
    @Query('account_id') accountId: number,
    @Res() response: Response
  ) {
    const result = await this.accountsService.getAccount(accountId)
    const { id, balance } = result ? result : { id: 0, balance: 0 }
    const status = id ? HttpStatus.OK : HttpStatus.NOT_FOUND

    return response.status(status).send(String(balance))
  }
}
