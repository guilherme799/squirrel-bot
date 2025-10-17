import { MessageMediaType } from "../../domain/enums/message-media-type-enum";

export interface SavedFile {
  id: number;
  name: string;
  type: MessageMediaType;
  groupJid: string;
  coments: Array<string>;
}
