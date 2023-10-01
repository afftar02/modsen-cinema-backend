import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { DataSource, Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private repository: Repository<Review>,
    @Inject(MovieService)
    private movieService: MovieService,
    private readonly logger: Logger,
    private dataSource: DataSource,
  ) {}

  async create(movieId: number, dto: CreateReviewDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const review = this.repository.create(dto);

      review.movie = await this.movieService.findOne(movieId);

      const savedReview = await queryRunner.manager.save(review);

      await this.movieService.updateMovieRating(movieId, queryRunner);

      await queryRunner.commitTransaction();

      return savedReview;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Unable to create review', err.stack);
    } finally {
      await queryRunner.release();
    }
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
    const review = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateResult = await queryRunner.manager.update(Review, id, dto);

      if (dto.rating) {
        await this.movieService.updateMovieRating(review.movie.id, queryRunner);
      }

      await queryRunner.commitTransaction();

      return updateResult;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Unable to update review', err.stack);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const review = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const deleteResult = await queryRunner.manager.delete(Review, id);

      await this.movieService.updateMovieRating(review.movie.id, queryRunner);

      await queryRunner.commitTransaction();

      return deleteResult;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Unable to delete review', err.stack);
    } finally {
      await queryRunner.release();
    }
  }
}
