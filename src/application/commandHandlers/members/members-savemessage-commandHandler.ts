import "reflect-metadata";
import {
  Service,
  ICommandHandler,
  WhatsAppCommand,
  ConfigService,
  AlertTypeEnum,
} from "squirrel-lib";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { SavedFilesService } from "../../services/savedfiles-service";

@Service({ id: "MembersSaveMessageCommandHandler", transient: true })
export class MembersSaveMessageCommandHandler implements ICommandHandler {
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
  context = ContextCommandUsage.members;

  constructor(
    private savedFilesService: SavedFilesService,
    private configService: ConfigService
  ) {
    this.usage = `(${this.configService.prefix}savemsg (marque a imagem/gif/video/audio) 
    ou ${this.configService.prefix}savemessage (responda a imagem/gif/video/audio)) Nome da mídia [Comentário opcional da mídia]`;
  }

  public async handle(command: WhatsAppCommand): Promise<void> {
    await command.sendAlert(AlertTypeEnum.waiting);

    let entity = await this.savedFilesService.saveFile(command);
    
    await command.replyAlert(
      `Arquivo *_${entity.name}_* foi salvo com sucesso!\n 
      Para enviar o arquivo utilize o comando *_${this.configService.prefix}sendfile ${entity.name}_*`,
      AlertTypeEnum.success
    );
  }
}
