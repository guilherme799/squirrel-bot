import "reflect-metadata";
import path from "path";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { IMediaCommandHandler } from "../../contracts/imedia-command-handler";
import {
  Service,
  ConfigService,
  WhatsAppCommand,
  AlertTypeEnum,
  InvalidArqumentsError,
  MediaExtensionsEnum,
} from "squirrel-lib";

@Service({ id: "MembersToImageCommandHandler", transient: true })
export class MembersToImageCommandHandler extends IMediaCommandHandler {
  name = "ToImage";
  description = "Comando para transformar figurinhas estáticas em imagem";
  variadions = ["toimage", "toimg", "2img", "i"];
  usage: string;
  context = ContextCommandUsage.members;
  isImage = true;

  constructor(private configService: ConfigService) {
    super();
    this.usage = `${this.configService.prefix}toimg (marque a figurinha) ou ${this.configService.prefix}toimg (responda a figurinha)`;
  }

  public async handle(command: WhatsAppCommand): Promise<void> {
    this.throwIfMessageIsInvalid(command);

    command.sendAlert(AlertTypeEnum.waiting);
    let { inputPath, outputPath } = await this.getTempFilePaths(command);

    this.executeCommand(
      command,
      `ffmpeg -i ${inputPath} ${outputPath}`,
      inputPath,
      outputPath
    );
  }

  private throwIfMessageIsInvalid(command: WhatsAppCommand) {
    if (!command.isSticker) {
      throw new InvalidArqumentsError(
        "Você deve marcar uma figurinha ou responder uma figurinha"
      );
    }
  }

  private async getTempFilePaths(command: WhatsAppCommand): Promise<{
    inputPath: string | null | undefined;
    outputPath: string;
  }> {
    let inputPath = await command.downloadMessage(
      "stickerToImage",
      MediaExtensionsEnum.webp
    );
    let outputPath = path.resolve(
      this.configService.tempDir,
      `output.${MediaExtensionsEnum.png}`
    );

    return { inputPath, outputPath };
  }
}
