import { Module } from '@nestjs/common';
import { AuthTranslationsService } from './auth.translations.service';

@Module({
  controllers: [],
  providers: [AuthTranslationsService],
  exports: [AuthTranslationsService],
})
export class TranslationsModule {}
