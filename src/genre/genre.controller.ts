import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('genre')
  create(@Body() dto: CreateGenreDto) {
    return this.genreService.create(dto);
  }

  @Get('genres')
  findAll() {
    return this.genreService.findAll();
  }

  @Get('genre/:id')
  findOne(@Param('id') id: string) {
    return this.genreService.findOne(+id);
  }

  @Patch('genre/:id')
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(+id, updateGenreDto);
  }

  @Delete('genre/:id')
  remove(@Param('id') id: string) {
    return this.genreService.remove(+id);
  }
}
