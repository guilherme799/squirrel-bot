import { ContextCommandUsage } from "../../application/enums/context-command-usage-enum";
import { WhatsAppCommand } from "../../domain/models/whatsapp-command-model";

declare interface ICommandHandler {
  name: string;
  description: string;
  variadions: Array<string>;
  usage: string;
  context: ContextCommandUsage;
  handle(command: WhatsAppCommand): Promise<void>;
}
