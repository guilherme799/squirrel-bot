import { MediaType } from "baileys";


export interface SavedFile {
  id?: number;
  name: string;
  type: MediaType;
  groupJid: string;
  coments: Array<string>;
}
