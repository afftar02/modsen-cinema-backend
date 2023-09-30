import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private repository: Repository<Review>,
    @Inject(MovieService)
    private movieService: MovieService,
    private readonly logger: Logger,
  ) {}

  async create(movieId: number, dto: CreateReviewDto) {
    const review = this.repository.create(dto);

    review.movie = await this.movieService.findOne(movieId);

    const savedReview = await this.repository.save(review);

    await this.movieService.updateMovieRating(movieId);

    return savedReview;
  }

  findByMovieId(movieId: number) {
    return this.repository.find({
      where: {
        movie: {
          id: movieId,
        },
      },
    });
  }

  async findOne(id: number) {
    const review = await this.repository.findOne({
      where: { id },
      relations: {
        movie: true,
      },
      select: {
        movie: {
          id: true,
        },
      },
    });

    if (!review) {
      const notFoundException = new NotFoundException('Review not found');

      this.logger.error('Unable to find review', notFoundException.stack);

      throw notFoundException;
    }

    return review;
  }

  async update(id: number, dto: UpdateReviewDto) {
    const review = await this.repository.findOne({
      where: { id },
      relations: {
        movie: true,
      },
      select: {
        movie: {
          id: true,
        },
      },
    });

    if (!review) {
      const notFoundException = new NotFoundException('Review not found');

      this.logger.error('Unable to find review', notFoundException.stack);

      throw notFoundException;
    }

    const updatedReview = await this.repository.update(id, dto);

    if (dto.rating) {
      await this.movieService.updateMovieRating(review.movie.id);
    }

    return updatedReview;
  }

  async remove(id: number) {
    const review = await this.repository.findOne({
      where: { id },
      relations: {
        movie: true,
      },
      select: {
        movie: {
          id: true,
        },
      },
    });

    if (!review) {
      const notFoundException = new NotFoundException('Review not found');

      this.logger.error('Unable to find review', notFoundException.stack);

      throw notFoundException;
    }

    const deletedReview = await this.repository.delete(id);

    await this.movieService.updateMovieRating(review.movie.id);

    return deletedReview;
  }
}
