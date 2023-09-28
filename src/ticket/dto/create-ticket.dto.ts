import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'IsPaid cannot be empty' })
  isPaid: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'IsVisited cannot be empty' })
  isVisited: boolean;
}
