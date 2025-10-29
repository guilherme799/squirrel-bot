import { Service } from "squirrel-lib";
import { SavedFile } from "../entities/saved.files";
import { BaseRepository } from "./base-repository";
import { ConnectionPoolService } from "../database/connection-pool-service";

@Service()
export class SavedFilesRepository extends BaseRepository<SavedFile> {
  constructor(connectionService: ConnectionPoolService) {
    super(connectionService, "SavedFiles");
  }

  public async findByName(
    name: string,
    remoteJid: string
  ): Promise<SavedFile | undefined> {
    let pool = await this.connectionService.getConnection();
    let result = await pool
      .request()
      .input("name", name)
      .input("remoteJid", remoteJid)
      .query<SavedFile>(`SELECT * FROM ${this.tableName} WHERE name = @name and remoteJid = @remoteJid`);

    return result.recordset.find(() => true);
  }
}
