import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../storage';
import { VIDEO_SIZE_LIMIT } from '../constants';

@Controller('trailer')
@ApiTags('Trailer')
export class TrailerController {
  constructor(private readonly trailerService: TrailerService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
      limits: {
        fileSize: VIDEO_SIZE_LIMIT,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(@UploadedFile() file: Express.Multer.File) {
    return this.trailerService.create(file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trailerService.remove(+id);
  }
}
