import { Module } from '@nestjs/common';
import { DatabaseHelper } from '../helpers/helper';

@Module({
  providers: [DatabaseHelper],
  exports: [DatabaseHelper],
})
export class HelperModule {}
export { DatabaseHelper };
