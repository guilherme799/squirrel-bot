import { exec } from "child_process";
import fs from "fs";
import { ContextCommandUsage } from "../enums/context-command-usage-enum";
import { WhatsAppCommand } from "../../domain/models/whatsapp-command-model";
import { WarningMessageError } from "../../domain/models/errors/warning-message-error";
import { AlertTypeEnum } from "../../domain/enums/alert-type-enum";
import { ICommandHandler } from "../../domain/contracts/icommand-handler";

export abstract class IMediaCommandHandler implements ICommandHandler {
  name!: string;
  description!: string;
  variadions!: string[];
  usage!: string;
  context!: ContextCommandUsage;
  abstract isImage:boolean;

  public abstract handle(command: WhatsAppCommand): Promise<void>;

  protected executeCommand(
    command: WhatsAppCommand,
    cmd: string,
    inputPath: string | null | undefined,
    outputPath: string | null | undefined
  ): void {
    exec(cmd, async (error) => {
      if (error) throw new WarningMessageError(JSON.stringify(error));
      await this.sendMessage(command, outputPath, inputPath);
    });
  }

  private async sendMessage(
    command: WhatsAppCommand,
    outputPath: string | null | undefined,
    inputPath: string | null | undefined
  ) {
    await command.sendAlert(AlertTypeEnum.success);
    await command.sendMessageFromFile(outputPath!, this.isImage);

    this.unlinkFiles(inputPath, outputPath!);
  }

  private unlinkFiles(
    inputPath: string | null | undefined,
    outputPath: string | null | undefined
  ) {
    fs.unlinkSync(inputPath!);
    fs.unlinkSync(outputPath!);
  }
}
