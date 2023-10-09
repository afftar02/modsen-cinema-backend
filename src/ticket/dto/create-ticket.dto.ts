import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    default: false,
  })
  @IsNotEmpty({ message: 'IsPaid cannot be empty' })
  isPaid: boolean;

  @ApiProperty({
    default: false,
  })
  @IsNotEmpty({ message: 'IsVisited cannot be empty' })
  isVisited: boolean;

  @ApiProperty({
    default: false,
  })
  @IsNotEmpty({ message: 'IsMissed cannot be empty' })
  isMissed: boolean;

  @ApiProperty({
    type: [Number],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  seatIds: number[];
}
