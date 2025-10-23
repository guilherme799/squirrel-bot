import "reflect-metadata";
import path from "path";
import {
  Service,
  ICommandHandler,
  ConfigService,
  WhatsAppCommand,
  AlertTypeEnum,
} from "squirrel-lib";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { delay } from "baileys";

@Service({ id: "MembersDiceCommandHandler", transient: true })
export class MembersDiceCommandHandler implements ICommandHandler {
  name = "Dice";
  description =
    "Comando para girar um dado e obter um valor aleatório entre 1 e 6";
  variadions = ["dado", "dice", "rolardado", "rolldice"];
  usage: string;
  context = ContextCommandUsage.members;

  constructor(private configService: ConfigService) {
    this.usage = `${this.configService.prefix}dado`;
  }

  public async handle(command: WhatsAppCommand): Promise<void> {
    await command.replyAlert("🎲 Rolando o dado...", AlertTypeEnum.waiting);

    let result = this.getRandomNumber(1, 6);

    await delay(2000);
    await command.sendMessageFromUrl(
      path.resolve(this.configService.stickersDir, "dice", `${result}.webp`),
      false
    );

    await command.sendReact(AlertTypeEnum.success);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
