import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from '../../movie/entities';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  description: string;

  @Column({ type: 'real' })
  rating: number;

  @ManyToOne(() => Movie, (movie) => movie.reviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  movie: Movie;
}
