import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { BalanceService } from './balance.service';
import { AddBalanceResponse } from '@src/interfaces';

@Controller('balance')
export class BalanceController {
  constructor(readonly balanceService: BalanceService) {}

  @Post()
  create(@Req() request: Request): Promise<AddBalanceResponse> {
    return this.balanceService.addBalance(request);
  }

  @Get()
  get(@Param('id') id: string) {
    return this.balanceService.getBalance(id);
  }

  @Get()
  listAll() {
    return this.balanceService.getAll();
  }
}
