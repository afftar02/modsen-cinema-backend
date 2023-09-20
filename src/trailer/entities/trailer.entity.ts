import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('trailer')
export class Trailer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;
}
