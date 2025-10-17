import path from "path";
import { ICommandHandler } from "../../../domain/contracts/icommand-handler";
import { AlertTypeEnum } from "../../../domain/enums/alert-type-enum";
import { WhatsAppCommand } from "../../../domain/models/whatsapp-command-model";
import { ConfigService } from "../../../domain/services/config-service";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { delay } from "baileys";

export class MembersDiceCommandHandler implements ICommandHandler {
  name = "Dice";
  description =
    "Comando para girar um dado e obter um valor aleatório entre 1 e 6";
  variadions = ["dado", "dice", "rolardado", "rolldice"];
  usage = `${ConfigService.prefix}dado`;
  context = ContextCommandUsage.members;

  public async handle(command: WhatsAppCommand): Promise<void> {
    await command.replyAlert("🎲 Rolando o dado...", AlertTypeEnum.waiting);

    let result = this.getRandomNumber(1, 6);

    await delay(2000);
    await command.sendMessageFromUrl(
      path.resolve(ConfigService.stickersDir, "dice", `${result}.webp`),
      false
    );

    await command.sendReact(AlertTypeEnum.success);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
