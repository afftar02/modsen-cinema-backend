import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateActorDto } from '../dto/create-actor.dto';
import { UpdateActorDto } from '../dto/update-actor.dto';

@Injectable()
export class ActorCapitalizationPipe
  implements PipeTransform<CreateActorDto | UpdateActorDto>
{
  transform(dto: CreateActorDto | UpdateActorDto) {
    if (dto.name) {
      dto['name'] =
        dto.name.charAt(0).toUpperCase() + dto.name.toLowerCase().slice(1);
    }

    if (dto.surname) {
      dto.surname =
        dto.surname.charAt(0).toUpperCase() +
        dto.surname.toLowerCase().slice(1);
    }

    return dto;
  }
}
