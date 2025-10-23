import "reflect-metadata";
import {
  Service,
  ICommandHandler,
  AlertTypeEnum,
  WarningMessageError,
  WhatsAppCommand,
  ConfigService,
} from "squirrel-lib";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { OpenAIService } from "../../services";

@Service({ id: "MembersGptCommandHandler", transient: true })
export class MembersGptCommandHandler implements ICommandHandler {
  name = "Gpt";
  description = "Comando responsável por buscar informações na OpenAI";
  variadions = ["gpt", "ia", "ai", "bot", "squirrel", "openai"];
  usage: string;
  context = ContextCommandUsage.members;

  constructor(
    private openaiService: OpenAIService,
    private configService: ConfigService
  ) {
    this.usage = `${this.configService.prefix}gpt`;
  }

  public async handle(command: WhatsAppCommand): Promise<void> {
    let content: string = this.tryGetContentFromArgs(command.args);

    await this.processMessage(command, content);
  }

  private tryGetContentFromArgs(args?: Array<any>) {
    let content: string = args?.find(() => true);
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
