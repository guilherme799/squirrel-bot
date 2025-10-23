import "reflect-metadata";
import { Service, ICommandHandler, WhatsAppCommand, ConfigService } from "squirrel-lib";
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
  usage: string;
  context = ContextCommandUsage.admin;

  constructor(
    private savedFilesService: SavedFilesService,
    private configService: ConfigService
  ) {
    this.usage = `(${this.configService.prefix}savemsg (marque a imagem/gif/video/audio) 
    ou ${this.configService.prefix}savemessage (responda a imagem/gif/video/audio)) Nome da mídia [Comentário opcional da mídia]`;
  }

  public async handle(command: WhatsAppCommand): Promise<void> {
    //TODO - validar o comando
    let entity = await this.savedFilesService.saveFile(command);
  }
}
