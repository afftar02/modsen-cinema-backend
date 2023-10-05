import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { CreatePersonDto } from '../person/dto/create-person.dto';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Body() dto: CreatePersonDto) {
    return this.authService.register(dto);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.refreshTokens(+req.user.sub, req.user.refreshToken);
  }
}
