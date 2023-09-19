import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), MovieModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
