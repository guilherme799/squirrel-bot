import { ICommandHandler } from "../../../domain/contracts/icommand-handler";
import { WhatsAppCommand } from "../../../domain/models/whatsapp-command-model";
import { ConfigService } from "../../../domain/services/config-service";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";

export class MembersPingCommandHandler implements ICommandHandler {
  name = "Ping";
  description = "Comando para verificar se o bot está online";
  variadions = ["ping", "pong"];
  usage = `${ConfigService.prefix}ping`;
  context = ContextCommandUsage.members;

  public async handle(command: WhatsAppCommand): Promise<void> {
    let response = command.commandName == "ping" ? "Pong" : "Ping";
    await command.sendReact("🏓");
    await command.replyText(`🏓 ${response}`);
  }
}
