import { Service } from "squirrel-lib";
import { SavedFile } from "../entities/saved.files";

@Service()
export class SavedFilesRepository {
  public async get(
    predicate: (filter: SavedFile) => boolean
  ): Promise<SavedFile[]> {
    throw new Error("Method not implemented.");
  }

  public async insert(entity: SavedFile): Promise<SavedFile> {
    entity.id = Math.random() * 1000;
    return entity;
  }

  public async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
