import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Accounts, Prisma, PrismaPromise } from '@prisma/client'
import { MISSING_ACCOUNT_ID } from '@src/constants'
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

  update(data: Prisma.AccountsUpdateInput): Promise<Accounts> {
    const { balance, id } = data
    return this.prismaService.accounts.update({
      where: {
        id: Number(id)
      },
      data: {
        balance: Number(balance)
      }
    })
  }

  /**
   * Remove funds from an account
   * @param {number} id the id of the account
   * @param {number} amount the amount to remove
   * @returns {Promise<Accounts>} the account object
   */
  async withDraw(id: number, amount: number): Promise<Accounts> {
    return await this.prismaService.accounts.update({
      where: {
        id: Number(id)
      },
      data: {
        balance: {
          decrement: Number(amount)
        }
      }
    })
  }

  /**
   * Add funds to an account
   * @param {number} id the id of the account
   * @param {number} amount the amount to add
   * @returns {Promise<Accounts>} the account object
   */
  async deposit(id: number, amount: number): Promise<Accounts> {
    return await this.prismaService.accounts.update({
      where: {
        id: Number(id)
      },
      data: {
        balance: {
          increment: Number(amount)
        }
      }
    })
  }

  /**
   * Transfers funds from one account to another
   * @param {number} originId the id of the origin account
   * @param {number} destinationId the id of the destination account
   * @param {number} amount the amount to transfer
   * @returns {Promise<Accounts>} the recipient account object
   */
  async transfer(
    originId: number,
    destinationId: number,
    amount: number
  ): Promise<Accounts> {
    return await this.prismaService.$transaction(async (prisma) => {
      const sender = await prisma.accounts.update({
        data: {
          balance: {
            decrement: amount
          }
        },
        where: {
          id: Number(originId)
        }
      })

      if (sender.balance < 0) {
        throw new HttpException(
          `${originId} doesn't have enough to send ${amount}`,
          HttpStatus.BAD_REQUEST
        )
      }

      const recipient = prisma.accounts.update({
        data: {
          balance: {
            increment: amount
          }
        },
        where: {
          id: Number(destinationId)
        }
      })

      return recipient
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
