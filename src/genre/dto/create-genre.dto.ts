import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;
}
