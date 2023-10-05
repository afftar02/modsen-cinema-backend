import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from '../../person/entities/person.entity';

@Entity('token')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  value: string;

  @OneToOne(() => Person, (person) => person.token, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  person: Person;
}
