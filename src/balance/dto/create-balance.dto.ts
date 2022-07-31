import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateBalanceDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  account_id: number;
}
