import { CepResponse, consultarCep } from "correios-brasil/dist";
import { AlertTypeEnum } from "../../../domain/enums/alert-type-enum";
import { InvalidArqumentsError } from "../../../domain/models/errors/invalid-arguments-error";
import { WhatsAppCommand } from "../../../domain/models/whatsapp-command-model";
import { ConfigService } from "../../../domain/services/config-service";
import { ContextCommandUsage } from "../../enums/context-command-usage-enum";
import { WarningMessageError } from "../../../domain/models/errors/warning-message-error";
import { ICommandHandler } from "../../../domain/contracts/icommand-handler";

export class MembersCepCommandHandler implements ICommandHandler {
  name = "Cep";
  description = "Comando para consultar um CEP na API dos correios";
  variadions = ["cep"];
  usage = `${ConfigService.prefix}cep 01001-001`;
  context = ContextCommandUsage.members;

  public async handle(command: WhatsAppCommand): Promise<void> {
    let cep = command.args?.find(() => true);
    this.throwIfCepIsInvalid(cep);

    let cepResponse = await this.tryGetCepResponse(cep);
    let message = this.buildMessage(cepResponse);

    command.replyAlert(message, AlertTypeEnum.success);
  }

  private throwIfCepIsInvalid(cep: string | undefined | null): void {
    if (!cep || ![8, 9].includes(cep.length)) {
      throw new InvalidArqumentsError(
        "Você deve informar um CEP no formato 00000-000 ou 00000000"
      );
    }
  }

  private async tryGetCepResponse(cep: any) {
    let cepResponse = await consultarCep(cep);
    if (!cepResponse.cep)
      throw new WarningMessageError("O cep informado não foi encotrado.");

    return cepResponse;
  }

  private buildMessage(cepResponse: CepResponse) {
    let message = "*Resultado*\n\n";
    for (let entry of Object.entries(cepResponse)) {
      let propName = entry[0],
        propValue = entry[1];

      message += `*${propName}:* ${propValue}\n`;
    }
    return message;
  }
}
