import path from "path";
import config from "../../../assets/config.json"
import packageInfo from "../../../package.json"
import { ContextConfig } from "../contracts/context-config";

export class ConfigService {
  public static get eventsTimeout(): number {
    return config.events_timeout;
  }

  public static get prefix(): string {
    return config.prefix;
  }

  public static get tempDir(): string {
    return path.resolve(__dirname, config.tempDir);
  }

  public static get openAIConfig(): { apiKey: string; url: string } {
    return config.openAIConfig;
  }

  public static get botConfig(): {
    emoji: string;
    name: string;
    phoneNumber: string;
  } {
    return config.botConfig;
  }

  public static get contextsConfig(): Array<ContextConfig> {
    return config.contexts;
  }

  public static get applicationVersion():string{
    return packageInfo.version;
  }
}
