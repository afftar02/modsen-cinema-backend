import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Session start cannot be empty' })
  @Type(() => Date)
  @IsDate()
  @MinDate(() => new Date(), { message: 'Session start is incorrect' })
  start: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Session end cannot be empty' })
  @Type(() => Date)
  @IsDate()
  @MinDate(() => new Date(), { message: 'Session end is incorrect' })
  end: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Session format cannot be empty' })
  format: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Movie id cannot be empty' })
  movieId: number;
}
