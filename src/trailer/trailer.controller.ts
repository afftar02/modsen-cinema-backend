import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../shared/common/storage';
import {
  IMAGE_EXT,
  VIDEO_EXT,
  VIDEO_SIZE_LIMIT,
} from '../shared/common/constants';

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
        fileFilter: (req: Request, file, cb) => {
          if (
            (file.fieldname === 'trailer' &&
              !VIDEO_EXT.includes(file.mimetype)) ||
            (file.fieldname === 'preview' && !IMAGE_EXT.includes(file.mimetype))
          ) {
            const badRequestException = new BadRequestException(
              `Invalid ${file.fieldname} type`,
            );

            return cb(badRequestException, false);
          }

          return cb(null, true);
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
