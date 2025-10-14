import { ICommandHandler } from "../../../domain/contracts/icommand-handler";
import { AlertTypeEnum } from "../../../domain/enums/alert-type-enum";
import { WarningMessageError } from "../../../domain/models/errors/warning-message-error";
import { WhatsAppCommand } from "../../../domain/models/whatsapp-command-model";
import { ConfigService } from "../../../domain/services/config-service";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { OpenAIService } from "../../services/openai-service";

export class MembersGptCommandHandler implements ICommandHandler {
  name = "Gpt";
  description = "Comando responsável por buscar informações na OpenAI";
  variadions = ["gpt", "ia", "ai", "bot", "squirrel", "openai"];
  usage = `${ConfigService.prefix}gpt`;
  context = ContextCommandUsage.members;

  constructor(private openaiService: OpenAIService) {}

  public async handle(command: WhatsAppCommand): Promise<void> {
    let content: string = this.tryGetContentFromArgs(command.args);

    await this.processMessage(command, content);
  }

  private tryGetContentFromArgs(args?: Array<any>) {
    let content: string = args?.firstOrDefault();
    if (!content)
      throw new WarningMessageError("Você precisa enviar um texto!");

    return content;
  }

  private async processMessage(command: WhatsAppCommand, content: string) {
    command.replyAlert("Aguarde...", AlertTypeEnum.waiting);
    let response = await this.openaiService.processPrompt(content);
    command.replyText(response);
  }
}
