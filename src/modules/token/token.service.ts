import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private repository: Repository<Token>,
  ) {}

  create(personId: number, value: string) {
    const token = this.repository.create({ value });

    return this.repository.save({
      ...token,
      person: { id: personId },
    });
  }

  findByPersonId(personId: number) {
    return this.repository.findOne({
      where: {
        person: {
          id: personId,
        },
      },
    });
  }

  update(id: number, value: string) {
    return this.repository.update(id, { value });
  }
}
