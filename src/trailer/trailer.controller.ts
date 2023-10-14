import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../storage';
import { VIDEO_SIZE_LIMIT } from '../constants';

@Controller('trailer')
@ApiTags('Trailer')
export class TrailerController {
  constructor(private readonly trailerService: TrailerService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'trailer', maxCount: 1 },
        { name: 'preview', maxCount: 1 },
      ],
      {
        storage: fileStorage,
        limits: {
          fileSize: VIDEO_SIZE_LIMIT,
        },
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        trailer: {
          type: 'string',
          format: 'binary',
        },
        preview: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @UploadedFiles()
    files: {
      trailer: Express.Multer.File[];
      preview: Express.Multer.File[];
    },
  ) {
    return this.trailerService.create(files.trailer, files.preview);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trailerService.remove(+id);
  }
}
