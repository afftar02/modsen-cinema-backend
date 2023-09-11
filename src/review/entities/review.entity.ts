import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
