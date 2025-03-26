import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  log(message: string) {
    super.log(`[CUSTOM] ${message}`);
  }

  error(message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace);
  }

  warn(message: string) {
    super.warn(`[WARNING] ${message}`);
  }

  debug(message: string) {
    super.debug(`[DEBUG] ${message}`);
  }

  verbose(message: string) {
    super.verbose(`[VERBOSE] ${message}`);
  }
}
