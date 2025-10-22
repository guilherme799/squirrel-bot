import "reflect-metadata";
import path from "path";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { DownloadableMessage, proto } from "baileys";
import { IMediaCommandHandler } from "../../contracts/imedia-command-handler";
import { ConfigService } from "../../../domain/services/config-service";
import { WhatsAppCommand } from "../../../domain/models/whatsapp-command-model";
import { AlertTypeEnum } from "../../../domain/enums/alert-type-enum";
import { MediaExtensionsEnum } from "../../../domain/enums/media-extensions-enum";
import { MessageMediaType } from "../../../domain/enums/message-media-type-enum";
import { InvalidArqumentsError } from "../../../domain/models/errors/invalid-arguments-error";
import { DangerMessageError } from "../../../domain/models/errors/danger-message-error";
import { Service } from "typedi";

@Service({ id: "MembersStickerCommandHandler", transient: true })
export class MembersStickerCommandHandler extends IMediaCommandHandler {
  name = "Sticker";
  description = "Comando para criar figurinhas de imagem/gif/video";
  variadions = ["sticker", "s", "fig", "f"];
  usage = `${ConfigService.prefix}sticker (marque a imagem/gif/video) ou ${ConfigService.prefix}sticker (responda a imagem/gif/video)`;
  context = ContextCommandUsage.members;
  isImage = false;

  public async handle(command: WhatsAppCommand): Promise<void> {
    this.ThrowIfMessageIsInvalid(command);

    command.sendAlert(AlertTypeEnum.waiting);
    let outputPath = path.resolve(
      ConfigService.tempDir,
      `output.${MediaExtensionsEnum.webp}`
    );

    if (command.messageMidiaType == MessageMediaType.image)
      await this.generateStickerFromImage(command, outputPath);
    else await this.generateStickerFromVideo(command, outputPath);
  }

  private ThrowIfMessageIsInvalid(command: WhatsAppCommand) {
    if (!command.isImageOrVideo) {
      throw new InvalidArqumentsError(
        "Você deve marcar uma imagem/gif/video ou responder uma imagem/gif/video"
      );
    }
  }

  private async generateStickerFromImage(
    command: WhatsAppCommand,
    outputPath: string
  ): Promise<void> {
    let inputPath = await command.downloadMessage(
      "imageToSticker",
      MediaExtensionsEnum.png
    );
    let cmd = `ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -f webp -quality 90 "${outputPath}"`;

    this.executeCommand(command, cmd, inputPath, outputPath);
  }

  private async generateStickerFromVideo(
    command: WhatsAppCommand,
    outputPath: string
  ): Promise<void> {
    let inputPath = await command.downloadMessage(
      "videoToSticker",
      MediaExtensionsEnum.mp4
    );
    this.ThrowIfVideoIsTooLarge(command.messageContent, inputPath);
    let cmd = `ffmpeg -y -i "${inputPath}" -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512, fps=15, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse" -f webp "${outputPath}"`;

    this.executeCommand(command, cmd, inputPath, outputPath);
  }

  private ThrowIfVideoIsTooLarge(
    messageContent: DownloadableMessage | null | undefined,
    inputPath: string | null | undefined
  ) {
    const maxDuration = 10;
    let videoDuration = (<proto.Message.IVideoMessage>messageContent).seconds;

    if (videoDuration == null || videoDuration > maxDuration) {
      throw new DangerMessageError(
        `O vídeo é maior que ${maxDuration}!\nEnvie um vídeo menor.`
      );
    }
  }
}
