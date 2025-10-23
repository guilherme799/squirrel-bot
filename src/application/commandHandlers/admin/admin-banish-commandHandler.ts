import "reflect-metadata";
import {
  AlertTypeEnum,
  ParticipantsActionEnum,
  InvalidArqumentsError,
  WhatsAppCommand,
  ConfigService,
  DangerMessageError,
  ICommandHandler,
  Service
} from "squirrel-lib";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";

@Service({ id: "AdminBanishCommandHandler", transient: true })
export class AdminBanishCommandHandler implements ICommandHandler {
  name = "Banish";
  description = "Comando para banir usuários do grupo";
  variadions = ["ban", "banish", "kick"];
  usage: string;
  context = ContextCommandUsage.admin;

  constructor(private configService: ConfigService) {
    this.usage = `${this.configService.prefix}ban @marcar_membro ou ${this.configService.prefix}ban (mencionando uma mensagem)`;
  }

  public async handle(command: WhatsAppCommand): Promise<void> {
    let memberToRemoveJid = this.tryGetMemberToRemove(command);

    await command.groupParticipantsUpdate(
      [memberToRemoveJid!],
      ParticipantsActionEnum.remove
    );
    await command.replyAlert(
      "Membro removido com sucesso!",
      AlertTypeEnum.success
    );
  }

  private tryGetMemberToRemove(command: WhatsAppCommand) {
    this.throwIfMessagemIsInvalid(command);
    let memberToRemoveJid = command.isReply
      ? command.remoteJid
      : this.getUserJid(command.args);

    this.throwIfUserCannotBeRemoved(memberToRemoveJid, command.userJid);
    return memberToRemoveJid;
  }

  private throwIfMessagemIsInvalid(command: WhatsAppCommand) {
    if (!command.args?.length && !command.isReply)
      throw new InvalidArqumentsError("Você precisa mencionar um membro!");
  }

  private getUserJid(args: string[] | undefined): string | null | undefined {
    let parsedArgs = `${args![0].replace(/[^0-9]/g, "")}`.replace("@", "");

    return parsedArgs.length >= 14
      ? `${parsedArgs}@lid`
      : `${parsedArgs}@s.whatsapp.net`;
  }

  private throwIfUserCannotBeRemoved(
    memberToRemoveJid: string | null | undefined,
    userJid: string | null | undefined
  ) {
    if (memberToRemoveJid == userJid)
      throw new DangerMessageError("Você não pode remover a você mesmo!");

    let botJid = this.getUserJid([this.configService.botConfig.phoneNumber]);
    if (memberToRemoveJid == botJid)
      throw new DangerMessageError("Você não pode me remover!");
  }
}
