import "reflect-metadata";
import "../../application/commandHandlers/members";
import "../../application/commandHandlers/admin";
import "../../application/commandHandlers/owner";
import "../../application/services";
import config from "../../../assets/config.json";
import Container from "typedi";
import { ConfigService } from "../../domain/services/config-service";

export function registerServices() {
  Container.set(ConfigService, new ConfigService(config));
  console.log("Services sucessfully registered.");
}
