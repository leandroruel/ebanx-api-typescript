import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Accounts, Prisma } from '@prisma/client'
import { MISSING_ACCOUNT_ID } from '@src/constants'
import { PrismaService } from '@src/prisma/prisma.service'
import { Response } from 'express'

@Injectable()
export class AccountsService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.AccountsCreateInput): Promise<Accounts> {
    const { balance, id } = data
    return this.prismaService.accounts.create({
      data: {
        id: Number(id),
        balance: Number(balance)
      }
    })
  }

  /**
   * Get a account by id
   * @param {number} id the id of the account
   * @returns {Promise<Accounts>} the account object
   */
  async getAccount(id: number): Promise<Accounts> {
    if (!id) throw new HttpException(MISSING_ACCOUNT_ID, HttpStatus.BAD_REQUEST)

    return await this.prismaService.accounts.findFirst({
      where: {
        id: Number(id)
      }
    })
  }
}
