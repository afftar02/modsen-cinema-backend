import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from './entities';
import { DataSource, Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';
import { Logger } from '@nestjs/common';

describe('ReviewController', () => {
  let reviewController: ReviewController;
  let reviewService: ReviewService;

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useClass: Repository,
        },
        {
          provide: MovieService,
          useValue: {},
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    reviewController = module.get<ReviewController>(ReviewController);
    reviewService = module.get<ReviewService>(ReviewService);
  });

  describe('create', () => {
    it('should create a review', async () => {
      const movieId = 1;
      const createReviewDto: CreateReviewDto = {
        author: 'Author',
        description: 'Review description',
        rating: 5,
      };
      const review: Review = {
        id: 1,
        author: 'Author',
        rating: 4,
        description: 'Good movie',
        movie: null,
      };

      jest.spyOn(reviewService, 'create').mockResolvedValue(review);

      const result = await reviewController.create(
        movieId.toString(),
        createReviewDto,
      );

      expect(result).toEqual(review);
    });
  });

  describe('findByMovieId', () => {
    it('should find reviews by movieId', async () => {
      const movieId = 1;
      const reviews = [new Review(), new Review()];

      jest.spyOn(reviewService, 'findByMovieId').mockResolvedValue(reviews);

      const result = await reviewController.findByMovieId(movieId.toString());

      expect(result).toEqual(reviews);
    });
  });

  describe('findOne', () => {
    it('should find a review by ID', async () => {
      const reviewId = 1;
      const review = new Review();

      jest.spyOn(reviewService, 'findOne').mockResolvedValue(review);

      const result = await reviewController.findOne(reviewId.toString());

      expect(result).toEqual(review);
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const reviewId = 1;
      const updateReviewDto: UpdateReviewDto = {
        rating: 8,
      };
      const updateResult = { generatedMaps: [], raw: [], affected: 1 };

      jest.spyOn(reviewService, 'update').mockResolvedValue(updateResult);

      const result = await reviewController.update(
        reviewId.toString(),
        updateReviewDto,
      );

      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      const reviewId = 1;
      const deleteResult = { raw: [], affected: 1 };

      jest.spyOn(reviewService, 'remove').mockResolvedValue(deleteResult);

      const result = await reviewController.remove(reviewId.toString());

      expect(result).toEqual(deleteResult);
    });
  });
});
