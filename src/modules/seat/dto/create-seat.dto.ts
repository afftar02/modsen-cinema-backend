import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty({ minimum: 0 })
  @IsNotEmpty({ message: 'Seat price cannot be empty' })
  @Min(0, { message: 'Seat price must be equal or greater than 0' })
  price: number;

  @ApiProperty({ minimum: 1, maximum: 10 })
  @IsNotEmpty({ message: 'Seat number cannot be empty' })
  @Min(1, { message: 'Seat number must be equal or greater than 1' })
  @Max(10, { message: 'Seat number must be equal or less than 10' })
  number: number;

  @ApiProperty({ minimum: 1, maximum: 15 })
  @IsNotEmpty({ message: 'Seat row cannot be empty' })
  @Min(1, { message: 'Seat row must be equal or greater than 1' })
  @Max(15, { message: 'Seat row must be equal or less than 15' })
  row: number;
}
