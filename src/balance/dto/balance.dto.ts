import { IsNumber, IsNotEmpty } from 'class-validator';

export class AddBalance {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
