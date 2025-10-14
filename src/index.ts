import "reflect-metadata";
import "./domain/utils/array-utils";
import "./domain/utils/string-utils";
import { Container } from "typedi";
import { MainService } from "./domain/services/main-service";
import { MembersPingCommandHandler } from "./application/commandHandlers/members/members-ping-commandHandler";
import { MembersMenuCommandHandler } from "./application/commandHandlers/members/members-menu-commandHandler";
import { MembersCepCommandHandler } from "./application/commandHandlers/members/members-cep-commandHandler";
import { MembersGptCommandHandler } from "./application/commandHandlers/members/members-gpt-commandHandler";
import { OpenAIService } from "./application/services/openai-service";
import { MembersStickerCommandHandler } from "./application/commandHandlers/members/members-sticker-commandHandler";
import { MembersToImageCommandHandler } from "./application/commandHandlers/members/members-toimage-commandHandler";
import { AdminBanishCommandHandler } from "./application/commandHandlers/admin/admin-banish-commandHandler";

Container.get(MainService).start(
  /**
   * Members Command Handlers
   */
  new MembersPingCommandHandler(),
  new MembersMenuCommandHandler(),
  new MembersCepCommandHandler(),
  new MembersGptCommandHandler(Container.get(OpenAIService)),
  new MembersStickerCommandHandler(),
  new MembersToImageCommandHandler(),
  /**
   * Admin Command Handlers
   */
  new AdminBanishCommandHandler()
);
