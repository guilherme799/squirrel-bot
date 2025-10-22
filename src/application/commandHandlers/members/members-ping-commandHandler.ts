import "reflect-metadata";
import { ICommandHandler } from "../../../domain/contracts/icommand-handler";
import { WhatsAppCommand } from "../../../domain/models/whatsapp-command-model";
import { ConfigService } from "../../../domain/services/config-service";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { Service } from "typedi";

@Service({ id: "MembersPingCommandHandler", transient: true })
export class MembersPingCommandHandler implements ICommandHandler {
  name = "Ping";
  description = "Comando para verificar se o bot está online";
  variadions = ["ping", "pong"];
  usage: string;
  context = ContextCommandUsage.members;

  constructor(private configService: ConfigService) {
    this.usage = `${this.configService.prefix}ping`;
  }

  public async handle(command: WhatsAppCommand): Promise<void> {
    let response = command.commandName == "ping" ? "Pong" : "Ping";
    await command.sendReact("🏓");
    await command.replyText(`🏓 ${response}`);
  }
}
