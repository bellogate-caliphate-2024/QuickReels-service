import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  log(name:string ,message: string) {
    super.log(`${name} ${message}`);
  }
}
