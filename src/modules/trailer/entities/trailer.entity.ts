import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Preview } from '../../preview/entities';

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

  @OneToOne(() => Preview, (preview) => preview.trailer)
  @JoinColumn()
  preview: Preview;
}
