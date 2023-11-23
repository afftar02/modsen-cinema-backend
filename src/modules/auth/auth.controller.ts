import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { CreatePersonDto } from '../person/dto/create-person.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { FacebookOauthGuard } from './guards/facebook-oauth.guard';
import { GithubOauthGuard } from './guards/github-oauth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

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
    return this.authService.refreshToken(+req.user.sub, req.user.refreshToken);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.thirdPartyAuth(req.user);

    return res.redirect(
      this.configService.get<string>('AUTH_SUCCESS_REDIRECT') +
        `?accessToken=${tokens.access_token}&refreshToken=${tokens.refresh_token}`,
    );
  }

  @Get('facebook')
  @UseGuards(FacebookOauthGuard)
  facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(FacebookOauthGuard)
  async facebookAuthCallback(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.thirdPartyAuth(req.user);

    return res.redirect(
      this.configService.get<string>('AUTH_SUCCESS_REDIRECT') +
        `?accessToken=${tokens.access_token}&refreshToken=${tokens.refresh_token}`,
    );
  }

  @Get('github')
  @UseGuards(GithubOauthGuard)
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubOauthGuard)
  async githubAuthCallback(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.thirdPartyAuth(req.user);

    return res.redirect(
      this.configService.get<string>('AUTH_SUCCESS_REDIRECT') +
        `?accessToken=${tokens.access_token}&refreshToken=${tokens.refresh_token}`,
    );
  }
}