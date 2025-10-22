import "reflect-metadata";
import Container, { Service } from "typedi";
import { ConnectionService } from "./connection-service";
import { Configuration } from "../contracts/context-config";
import { ConfigService } from "./config-service";

@Service({ transient: true })
export class MainService {
  constructor(private connectionService: ConnectionService) {}

  public async start(config: Configuration): Promise<void> {
    Container.set(ConfigService, new ConfigService(config));
    await this.connectionService.connect();
  }
}
