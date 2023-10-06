import { ForbiddenException, Injectable } from '@nestjs/common';
import { PersonService } from '../person/person.service';
import { JwtService } from '@nestjs/jwt';
import { Person } from '../person/entities/person.entity';
import { CreatePersonDto } from '../person/dto/create-person.dto';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private personService: PersonService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.personService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPass = await bcrypt.compare(password, user.password);

    if (isValidPass) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: Person) {
    const tokens = this.generateTokensForUser(user);
    const currentRefreshToken = await this.tokenService.findByPersonId(user.id);

    try {
      this.jwtService.verify(currentRefreshToken.value, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      tokens.refresh_token = currentRefreshToken.value;
    } catch (err) {
      await this.tokenService.update(
        currentRefreshToken.id,
        tokens.refresh_token,
      );
    }

    return tokens;
  }

  async register(dto: CreatePersonDto) {
    const user = await this.personService.create(dto);
    const tokens = this.generateTokensForUser(user);

    await this.tokenService.create(user.id, tokens.refresh_token);

    return tokens;
  }

  async refreshToken(userId: number, refreshToken: string) {
    const currentRefreshToken = await this.tokenService.findByPersonId(userId);

    if (currentRefreshToken.value !== refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const user = await this.personService.findOne(userId);
    const tokens = this.generateTokensForUser(user);

    return {
      access_token: tokens.access_token,
    };
  }

  generateTokensForUser(user: Person) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '7d',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      }),
    };
  }
}
