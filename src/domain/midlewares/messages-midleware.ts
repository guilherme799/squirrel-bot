import "reflect-metadata";
import { Service } from "typedi";
import { WhatsAppCommand } from "../models/whatsapp-command-model";
import { CommandService } from "../services/command-service";
import { WAMessage, WASocket } from "baileys";
import { ConsoleService } from "../services/console-service";

@Service()
export class MessagesMidleware {
  constructor(private commandService: CommandService) {}

  public async handleMessageUpsert(
    socket: WASocket,
    messages: Array<WAMessage>
  ): Promise<void> {
    if (!messages.any()) return;

    let message = this.tryGetMessage(messages);
    let waCommand = this.tryGetDataFromMessage(message!, socket);

    await this.commandService.executeDynamicCommand(waCommand!);
  }

  private tryGetMessage(messages: WAMessage[]) {
    let message = messages.firstOrDefault();
    if (!message) ConsoleService.logError("messagem not found");

    return message;
  }

  private tryGetDataFromMessage(
    whatsappMessagesage: WAMessage,
    socket: WASocket
  ): WhatsAppCommand {
    return new WhatsAppCommand(whatsappMessagesage, socket);
  }
}
