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
import { CreateTitleDto } from './create-title.dto';
import { CreateDescriptionDto } from './create-description.dto';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: CreateTitleDto;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: CreateDescriptionDto;

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
