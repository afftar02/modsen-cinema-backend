import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Please, add an author of review' })
  author: string;

  @IsNotEmpty({ message: 'Review description cannot be empty' })
  description: string;

  @Min(0, { message: 'Rating must be equal or greater than 0' })
  @Max(10, { message: 'Rating must be equal or less than 10' })
  rating: number;
}
