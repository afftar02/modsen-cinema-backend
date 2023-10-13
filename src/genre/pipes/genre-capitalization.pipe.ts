import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { UpdateGenreDto } from '../dto/update-genre.dto';

@Injectable()
export class GenreCapitalizationPipe
  implements PipeTransform<CreateGenreDto | UpdateGenreDto>
{
  transform(dto: CreateGenreDto | UpdateGenreDto) {
    if (dto.title) {
      dto.title =
        dto.title.charAt(0).toUpperCase() + dto.title.toLowerCase().slice(1);
    }

    return dto;
  }
}
