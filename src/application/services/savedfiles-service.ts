import "reflect-metadata";
import { SavedFilesRepository } from "../../infrastucture/repositories/savedfiles-repository";
import { SavedFile } from "../../infrastucture/entities/saved.files";
import {
  Service,
  WhatsAppCommand,
  WarningMessageError,
  MediaExtensionsEnum,
  MessageMediaType,
  ConfigService,
} from "squirrel-lib";
import { MediaType } from "baileys";
import fs from "fs";
import path from "path";

@Service()
export class SavedFilesService {
  constructor(
    private repository: SavedFilesRepository,
    private configService: ConfigService
  ) {}

  public async saveFile(command: WhatsAppCommand): Promise<SavedFile> {
    let { fileName, extension } = await this.tryGetFileInfo(
      command.args,
      command.messageMidiaType!,
      command.remoteJid!
    );
    let entity: SavedFile = {
      id: crypto.randomUUID(),
      name: fileName,
      type: command.messageMidiaType!,
      comments: command.args?.shift(),
      remoteJid: command.remoteJid,
    };

    await command.downloadMessage(entity.id, extension);
    await this.repository.insert(entity);

    return entity;
  }

  private async tryGetFileInfo(
    args: any[] | undefined,
    midiaType: MediaType,
    remoteJid: string
  ): Promise<{
    fileName: string;
    extension: MediaExtensionsEnum;
  }> {
    if (!args?.any()) {
      throw new WarningMessageError(
        "Você deve informar um nome para o arquivo."
      );
    }

    let fileName = args!.find(() => true).replace(/[^a-zA-Z0-9]/g, "");
    await this.throwIfFileNameIsDuplicated(fileName, remoteJid);

    return {
      fileName: fileName,
      extension: this.getFileExtension(midiaType),
    };
  }

  private async throwIfFileNameIsDuplicated(fileName: any, remoteJid: string) {
    let entity = await this.repository.findByName(fileName, remoteJid);
    if (entity) {
      throw new WarningMessageError(
        `Já existe um arquivo salvo com o nome *_${fileName}_*. Por favor, escolha outro nome.`
      );
    }
  }

  public async getFilePath(
    fileName: string,
    remoteJid: string
  ): Promise<string> {
    return await this.tryGetFilePath(fileName, remoteJid);
  }

  private async tryGetFilePath(
    fileName: string,
    remoteJid: string
  ): Promise<string> {
    let entity = await this.tryGetEntityByName(fileName, remoteJid);
    let filePath = path.resolve(
      this.configService.tempDir,
      `${entity.id}.${this.getFileExtension(entity.type)}`
    );

    if (!fs.existsSync(filePath)) {
      throw new WarningMessageError(
        `Arquivo *_${fileName}_* não encontrado no servidor.`
      );
    }

    return filePath;
  }

  private async tryGetEntityByName(fileName: string, remoteJid: string) {
    let entity = await this.repository.findByName(fileName, remoteJid);
    if (!entity)
      throw new WarningMessageError(`Arquivo *_${fileName}_* não encontrado.`);
    return entity;
  }

  private getFileExtension(midiaType: MediaType): MediaExtensionsEnum {
    switch (midiaType) {
      case MessageMediaType.image:
        return MediaExtensionsEnum.png;
      case MessageMediaType.video:
        return MediaExtensionsEnum.mp4;
      case MessageMediaType.audio:
        return MediaExtensionsEnum.mp3;
      case MessageMediaType.sticker:
        return MediaExtensionsEnum.webp;
      default:
        throw new WarningMessageError(
          "Tipo de mídia não suportado. Utilize imagem, vídeo, áudio ou figurinha."
        );
    }
  }
}
