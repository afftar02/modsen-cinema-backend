import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  format: string;

  @ManyToOne(() => Movie, (movie) => movie.sessions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  movie: Movie;
}
