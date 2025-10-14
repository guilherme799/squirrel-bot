import "reflect-metadata";
import * as readLine from "readline";
import { ConfigService } from "./config-service";

export class ConsoleService {
  public static question(message: string): Promise<string> {
    const readline = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => readline.question(`\x1b[30m[${ConfigService.botConfig.name} | INPUT]\x1b[0m${message}`, resolve));
  }

  public static logInfo(message: string): void {
    console.log(
      `\x1b[34m[${ConfigService.botConfig.name} | INFO]\x1b[0m ${message}`
    );
  }

  public static logError(message: string): void {
    console.error(
      `\x1b[31m[${ConfigService.botConfig.name} | ERROR]\x1b[0m ${message} Try again with "npm start"`
    );

    process.exit(1);
  }

  public static logWarning(message: string): void {
    console.warn(
      `\x1b[33m[${ConfigService.botConfig.name} | WARNING]\x1b[0m ${message}`
    );
  }

  public static logSuccess(message: string): void {
    console.log(
      `\x1b[32m[${ConfigService.botConfig.name} | SUCCESS]\x1b[0m ${message}`
    );
  }
}
