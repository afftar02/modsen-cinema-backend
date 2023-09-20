import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PosterService } from './poster.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../storage';
import { IMAGE_SIZE_LIMIT } from '../constants';

@Controller('poster')
@ApiTags('Poster')
export class PosterController {
  constructor(private readonly posterService: PosterService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
      limits: {
        fileSize: IMAGE_SIZE_LIMIT,
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
    return this.posterService.create(file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posterService.remove(+id);
  }
}
