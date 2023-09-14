import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actor')
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;
}
