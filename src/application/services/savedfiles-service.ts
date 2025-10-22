import "reflect-metadata";
import { Inject, Service } from "typedi";
import { SavedFilesRepository } from "../../infrastucture/repositories/savedfiles-repository";
import { SavedFile } from "../../infrastucture/entities/saved.files";
import { WhatsAppCommand } from "../../domain/models/whatsapp-command-model";
import { WarningMessageError } from "../../domain/models/errors/warning-message-error";

@Service()
export class SavedFilesService {
  constructor(private repository: SavedFilesRepository) {}

  public async saveFile(
    command: WhatsAppCommand
  ): Promise<SavedFile | null | undefined> {
    let fileName = this.tryGetFileName(command.args);

    return await this.repository.insert({
      name: fileName,
      coments: command.args?.shift(),
      groupJid: command.remoteJid!,
      type: command.messageMidiaType!,
    });
  }

  private tryGetFileName(args: any[] | undefined): string {
    if (!args?.any())
      throw new WarningMessageError(
        "Você deve informar um nome para o arquivo."
      );

    return args!.find(() => true);
  }
}
