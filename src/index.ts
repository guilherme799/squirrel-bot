import { registerServices } from "./infrastucture/ioc/typedi-loader";
import { MainService, Container } from "squirrel-lib";

registerServices();
Container.get(MainService).start();
