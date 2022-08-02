import { Controller, Post, Body } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto)
  }
}
