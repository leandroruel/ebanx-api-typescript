import { Injectable } from '@nestjs/common'
import { Accounts, Prisma } from '@prisma/client'
import { PrismaService } from '@src/prisma/prisma.service'

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
  getAccount(id: number): Promise<Accounts> {
    return this.prismaService.accounts.findFirst({
      where: {
        id: Number(id)
      }
    })
  }
}
