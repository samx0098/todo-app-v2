import { Module } from '@nestjs/common';
import { ResponseHandlerService } from 'utils/responseHandler';

@Module({
  providers: [ResponseHandlerService],
  exports: [ResponseHandlerService], // Make it available for other modules
})
export class CommonModule {} // or SharedModule
