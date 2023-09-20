import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CountryService } from '../country/country.service';
import { ActorService } from '../actor/actor.service';
import { GenreService } from '../genre/genre.service';
import { PosterService } from '../poster/poster.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private repository: Repository<Movie>,
    @Inject(CountryService)
    private countryService: CountryService,
    @Inject(ActorService)
    private actorService: ActorService,
    @Inject(GenreService)
    private genreService: GenreService,
    @Inject(PosterService)
    private posterService: PosterService,
  ) {}

  async bindRelations(movie: Movie, dto: CreateMovieDto | UpdateMovieDto) {
    if (dto.countryId) {
      movie.country = await this.countryService.findOne(dto.countryId);
    }
    if (dto.actorIds) {
      movie.actors = await this.actorService.findByIds(dto.actorIds);
    }
    if (dto.genreIds) {
      movie.genres = await this.genreService.findByIds(dto.genreIds);
    }
    if (dto.posterId) {
      movie.poster = await this.posterService.findOne(dto.posterId);
    }
  }

  async create(dto: CreateMovieDto) {
    const movie = this.repository.create(dto);

    await this.bindRelations(movie, dto);

    return this.repository.save(movie);
  }

  findAll() {
    return this.repository.find({
      relations: {
        genres: true,
        poster: true,
      },
    });
  }

  async findOne(id: number) {
    const movie = await this.repository.findOne({
      where: { id },
      relations: {
        reviews: true,
        country: true,
        actors: true,
        genres: true,
        poster: true,
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async update(id: number, dto: UpdateMovieDto) {
    const movie = await this.repository.findOne({
      where: { id },
      relations: {
        poster: true,
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const updateMovie = {
      ...movie,
      ...this.repository.create(dto),
    };

    await this.bindRelations(updateMovie, dto);

    if (dto.posterId) {
      await this.posterService.remove(movie.poster.id);
    }

    return this.repository.save(updateMovie);
  }

  async remove(id: number) {
    const movie = await this.repository.findOne({
      where: { id },
      relations: {
        poster: true,
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (movie.poster) {
      await this.posterService.remove(movie.poster.id);
    }

    return this.repository.delete(id);
  }
}
