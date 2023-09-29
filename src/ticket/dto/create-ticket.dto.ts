import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'IsPaid cannot be empty' })
  isPaid: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'IsVisited cannot be empty' })
  isVisited: boolean;

  @ApiProperty({
    type: [Number],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  seatIds: number[];
}
