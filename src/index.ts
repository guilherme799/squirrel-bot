import "reflect-metadata";
import "./domain/utils/array-utils";
import "./domain/utils/string-utils";
import { Container } from "typedi";
import { MainService } from "./domain/services/main-service";
import { registerServices } from "./infrastucture/ioc/typedi-loader";
import config from "../assets/config.json";

registerServices();
Container.get(MainService).start(config);
