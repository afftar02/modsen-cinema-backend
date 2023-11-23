import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trailer } from '../../trailer/entities';

@Entity('preview')
export class Preview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @OneToOne(() => Trailer, (trailer) => trailer.preview)
  trailer: Trailer;
}
