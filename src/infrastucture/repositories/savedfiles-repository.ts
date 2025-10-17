import { Service } from "typedi";
import { SavedFile } from "../entities/saved.file";

export class SavedFilesRepository implements IRepository<SavedFile> {

    public async get(predicate: (filter: SavedFile) => boolean): Promise<SavedFile[]> {
        throw new Error("Method not implemented.");
    }

    public async insert(entity: SavedFile): Promise<SavedFile> {
        throw new Error("Method not implemented.");
    }

    public async delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
