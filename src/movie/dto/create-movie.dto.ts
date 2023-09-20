import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  MinDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Movie title cannot be empty' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Movie description cannot be empty' })
  description: string;

  @ApiProperty({
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @Min(0, { message: 'Rating must be equal or greater than 0' })
  @Max(10, { message: 'Rating must be equal or less than 10' })
  rating: number;

  @ApiProperty({
    minimum: 0,
    maximum: 18,
  })
  @IsNotEmpty({ message: 'Please, add age restriction' })
  @Min(0, { message: 'Age restriction must be equal or greater than 0' })
  @Max(18, { message: 'Age restriction must be equal or less than 18' })
  ageRestriction: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Please, add quality of movie' })
  quality: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MinDate(() => new Date(), { message: 'Movie start date is incorrect' })
  start: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Movie author cannot be empty' })
  author: string;

  @ApiProperty()
  @IsOptional()
  countryId: number;

  @ApiProperty({
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  actorIds: number[];

  @ApiProperty({
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  genreIds: number[];

  @ApiProperty()
  @IsOptional()
  posterId: number;

  @ApiProperty()
  @IsOptional()
  trailerId: number;
}
