import { Module } from '@nestjs/common';
import { Helper } from '../helpers/helper';

@Module({
  providers: [Helper],
  exports: [Helper],
})
export class HelperModule {}
export { Helper };
