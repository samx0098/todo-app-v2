import { Module } from '@nestjs/common';
import { ResponseHandlerService } from 'utils/response-handler';

@Module({
  providers: [ResponseHandlerService],
  exports: [ResponseHandlerService], // Make it available for other modules
})
export class CommonModule {} // or SharedModule
