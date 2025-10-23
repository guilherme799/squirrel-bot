import "reflect-metadata";
import { Service, ICommandHandler, WhatsAppCommand, ConfigService } from "squirrel-lib";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";

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
