import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('poster')
export class Poster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;
}
