import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGenreDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @Transform(({ value }) => value.toLowerCase())
  title: string;
}
