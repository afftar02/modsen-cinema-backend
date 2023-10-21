import { Review } from 'src/review/entities/review.entity';
import { Country } from 'src/country/entities/country.entity';
import { Actor } from 'src/actor/entities/actor.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { Poster } from 'src/poster/entities/poster.entity';
import { Trailer } from 'src/trailer/entities/trailer.entity';
import { Movie } from '../entities/movie.entity';

export class FindMovieDto {
  constructor(movie: Movie, language: string) {
    for (const key in movie) {
      if (key.startsWith('title')) {
        if (key.slice(-2) === language) {
          this.title = movie[key];
        }
      } else if (key.startsWith('description')) {
        if (key.slice(-2) === language) {
          this.description = movie[key];
        }
      } else {
        this[key] = movie[key];
      }
    }
  }

  id: number;

  title: string;

  description: string;

  rating: number;

  ageRestriction: number;

  quality: string;

  start: Date;

  author: string;

  reviews?: Review[];

  country?: Country;

  actors?: Actor[];

  genres?: Genre[];

  poster?: Poster;

  trailer?: Trailer;
}
