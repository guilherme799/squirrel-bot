import "reflect-metadata";
import { Service } from "typedi";
import { ConnectionService } from "./connection-service";

@Service({ transient: true })
export class MainService {
  constructor(private connectionService: ConnectionService) {}

  public async start(): Promise<void> {
    await this.connectionService.connect();
  }
}
