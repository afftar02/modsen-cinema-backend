import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from '../../person/entities';

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

  @OneToOne(() => Person, (person) => person.avatar, {
    nullable: true,
  })
  person: Person;
}
