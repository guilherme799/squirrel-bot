import "reflect-metadata";
import "../../application/commandHandlers/members";
import "../../application/commandHandlers/admin";
import "../../application/commandHandlers/owner";
import { ConsoleService } from "../../domain/services/console-service";

export function registerServices() {
  ConsoleService.logInfo("Services sucessfully registered.");
}
