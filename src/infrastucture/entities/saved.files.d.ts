import { MediaType } from "baileys";
import { UUID } from "crypto";

export interface SavedFile {
  id: UUID;
  name: string;
  type: MediaType;
  remoteJid?: string | undefined | null;
  comments: Array<string>;
}
