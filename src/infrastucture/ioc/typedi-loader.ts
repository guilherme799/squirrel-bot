import "reflect-metadata";
import "../../application/commandHandlers/members";
import "../../application/commandHandlers/admin";
import "../../application/commandHandlers/owner";
import "../../application/services";
import "squirrel-lib";
import config from "../../../assets/config.json";
import { ConfigService, Container } from "squirrel-lib";

export function registerServices() {
  Container.set(ConfigService, new ConfigService(config));
  console.log("Services sucessfully registered.");
}
