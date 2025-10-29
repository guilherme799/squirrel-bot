import "reflect-metadata";
import {
  AlertTypeEnum,
  ConfigService,
  ICommandHandler,
  Service,
  WarningMessageError,
  WhatsAppCommand,
} from "squirrel-lib";
import { SavedFilesService } from "../../services";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";

@Service({ id: "MembersSendFileCommandHandler", transient: true })
export class MembersSendFileCommandHandler implements ICommandHandler {
  name = "SendFile";
  description =
    "Comando utilizado para mandar mensagens multímidias salvas pelo bot";
  variadions = [
    "send",
    "sendfile",
    "sendfilemsg",
    "sendfilemessage",
    "enviar",
    "enviararquivo",
    "enviararquivomsg",
    "enviararquivomensagem",
  ];
  usage: string;
  context = ContextCommandUsage.members;

  constructor(
    private savedFilesService: SavedFilesService,
    private configService: ConfigService
  ) {
    this.usage = `(${this.configService.prefix}sendfile (nome do arquivo)`;
  }

  public async handle(command: WhatsAppCommand): Promise<void> {
    await command.sendAlert(AlertTypeEnum.waiting);

    let fileName = this.tryGetFileName(command);
    let filePath = await this.savedFilesService.getFilePath(
      fileName,
      command.remoteJid!
    );

    await command.sendMessageFromFile(filePath);
    await command.sendAlert(AlertTypeEnum.success);
  }

  private tryGetFileName(command: WhatsAppCommand) {
    let fileName = command.args?.find(() => true);

    if (!command.args?.any()) {
      throw new WarningMessageError(
        "Você deve informar um nome para o arquivo."
      );
    }

    return fileName;
  }
}
