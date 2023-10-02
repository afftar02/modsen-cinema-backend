import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('avatar')
export class Avatar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;
}
