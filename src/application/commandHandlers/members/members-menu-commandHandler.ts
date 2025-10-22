import "reflect-metadata";
import Container, { Service } from "typedi";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { ConfigService } from "../../../domain/services/config-service";
import { WhatsAppCommand } from "../../../domain/models/whatsapp-command-model";
import {
  CommandConfig,
  ContextConfig,
} from "../../../domain/contracts/context-config";
import { ICommandHandler } from "../../../domain/contracts/icommand-handler";

@Service({ id: "MembersMenuCommandHandler", transient: true })
export class MembersMenuCommandHandler implements ICommandHandler {
  name = "Menu";
  description = "Comando para exibir o menu do bot";
  variadions = ["menu", "help", "info"];
  usage = `${ConfigService.prefix}menu`;
  context = ContextCommandUsage.members;

  public async handle(command: WhatsAppCommand): Promise<void> {
    let { whatsAppMessage, args } = command;
    await command.replyText(this.getMenuMessage(whatsAppMessage?.pushName));
  }

  private getMenuMessage(requestedUserName: string | null | undefined): string {
    const date = new Date();
    const readMore = "\u200B".repeat(950);
    const { prefix, applicationVersion, botConfig } = ConfigService;

    let menu = `╭━━⪩ BEM VINDO! *${requestedUserName}* ⪨━━${readMore}
▢
▢ • ${botConfig.name}
▢ • Data: ${date.toLocaleDateString("pt-br")}
▢ • Hora: ${date.toLocaleTimeString("pt-br")}
▢ • Prefixo: ${prefix}
▢ • Versão: ${applicationVersion}
▢
╰━━─「🪐」─━━`;

    for (let contexConfig of ConfigService.contextsConfig) {
      menu += `\n╭━━⪩ ${contexConfig.name} ⪨━━\n▢`;
      for (let command of contexConfig.commands) {
        let commandHandler: ICommandHandler = this.getCommandHandler(
          command,
          contexConfig
        );
        menu += `\n▢ • ${prefix}${command.name.toLocaleLowerCase()} (${
          commandHandler.description
        })`;
      }
      menu += `\n▢\n╰━━─「${contexConfig.icon}」─━━\n`;
    }

    return menu;
  }

  private getCommandHandler(
    command: CommandConfig,
    contexConfig: ContextConfig
  ): ICommandHandler {
    if (command.name != "Menu") {
      return Container.get<ICommandHandler>(
        `${contexConfig.name}${command.name}CommandHandler`
      );
    } else {
      return this;
    }
  }
}
