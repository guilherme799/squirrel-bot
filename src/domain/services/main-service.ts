import "reflect-metadata";
import { Container, Service } from "typedi";
import { ConnectionService } from "./connection-service";
import { ICommandHandler } from "../contracts/icommand-handler";

@Service({ transient: true })
export class MainService {
  constructor(private connectionService: ConnectionService) {}

  public async start(
    ...commandHandlers: Array<ICommandHandler>
  ): Promise<void> {
    this.registerCommandHandlers(commandHandlers);
    await this.connectionService.connect();
  }

  private registerCommandHandlers(commandHandlers: Array<ICommandHandler>) {
    for (let commandHandler of commandHandlers) {
      let commandHandlerName = `${commandHandler.context}${commandHandler.name}CommandHandler`;
      Container.set<ICommandHandler>(commandHandlerName, commandHandler);
    }
  }
}
