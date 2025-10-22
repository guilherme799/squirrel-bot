import "reflect-metadata";
import { Service } from "typedi";
import { ICommandHandler } from "../../../domain/contracts/icommand-handler";
import { WarningMessageError } from "../../../domain/models/errors/warning-message-error";
import { WhatsAppCommand } from "../../../domain/models/whatsapp-command-model";
import { ConfigService } from "../../../domain/services/config-service";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { SavedFilesService } from "../../services/savedfiles-service";

@Service({ id: "AdminSaveMessageCommandHandler", transient: true })
export class AdminSaveMessageCommandHandler implements ICommandHandler {
  name = "SaveMassage";
  description = "Comando utilizado para salvar uma mensagem multimídia";
  variadions = [
    "save",
    "savemessage",
    "savemsg",
    "salvar",
    "salvarMensagem",
    "salvarmsg",
  ];
  usage = `(${ConfigService.prefix}savemsg (marque a imagem/gif/video/audio) 
  ou ${ConfigService.prefix}savemessage (responda a imagem/gif/video/audio)) Nome da mídia [Comentário opcional da mídia]`;
  context = ContextCommandUsage.admin;

  constructor(private savedFilesService: SavedFilesService) {}

  public async handle(command: WhatsAppCommand): Promise<void> {
    //TODO - validar o comando
    let entity = await this.savedFilesService.saveFile(command);
  }
}
