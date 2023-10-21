import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageValidationPipe } from '../language-validation.pipe';

@Controller()
@ApiTags('Movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('movie')
  create(@Body() dto: CreateMovieDto) {
    return this.movieService.create(dto);
  }

  @Get('movies/:language')
  findAll(@Param('language', LanguageValidationPipe) language: string) {
    return this.movieService.findAllLocalized(language);
  }

  @Get('movie/:id/:language')
  findOne(
    @Param('id') id: string,
    @Param('language', LanguageValidationPipe) language: string,
  ) {
    return this.movieService.findOneLocalized(+id, language);
  }

  @Patch('movie/:id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(+id, updateMovieDto);
  }

  @Delete('movie/:id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }
}
