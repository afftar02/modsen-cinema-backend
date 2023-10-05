import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PersonService } from '../../person/person.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly personService: PersonService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: { email: string; sub: number }) {
    try {
      await this.personService.findOne(payload.sub);

      return { id: payload.sub, email: payload.email };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
