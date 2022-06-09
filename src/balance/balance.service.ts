import { Request } from 'express';

export class BalanceService {
  constructor() {}

  async addBalance(request: Request) {
    return {
      balance: 2
    };
  }

  async getBalance(id: string) {
    return {
      balance: 200
    };
  }

  async getAll() {
    return [
      {
        balance: 200
      },
      {
        balance: 300
      }
    ];
  }
}
