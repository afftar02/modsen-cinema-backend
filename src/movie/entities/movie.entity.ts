import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from '../../review/entities/review.entity';
import { Country } from '../../country/entities/country.entity';
import { Actor } from '../../actor/entities/actor.entity';
import { Genre } from '../../genre/entities/genre.entity';
import { Poster } from '../../poster/entities/poster.entity';
import { Trailer } from '../../trailer/entities/trailer.entity';
import { Session } from '../../session/entities/session.entity';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'real', nullable: true })
  rating: number;

  @Column()
  ageRestriction: number;

  @Column()
  quality: string;

  @Column({ nullable: true })
  start: Date;

  @Column()
  author: string;

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[];

  @ManyToOne(() => Country, (country) => country.movies, {
    onDelete: 'SET NULL',
  })
  country: Country;

  @ManyToMany(() => Actor, (actor) => actor.movies)
  @JoinTable()
  actors: Actor[];

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];

  @OneToOne(() => Poster, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  poster: Poster;

  @OneToOne(() => Trailer, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  trailer: Trailer;

  @OneToMany(() => Session, (session) => session.movie)
  sessions: Session[];
}
