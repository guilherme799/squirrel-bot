import { connect } from "mssql";
import { ConnectionPoolService } from "../database/connection-pool-service";

export abstract class BaseRepository<T extends object> {
  constructor(
    protected connectionService: ConnectionPoolService,
    protected tableName: string
  ) {}

  public async findAll(): Promise<T[]> {
    let pool = await this.connectionService.getConnection();
    let result = await pool.request().query(`SELECT * FROM ${this.tableName}`);

    return result.recordset as T[];
  }

  public async findById(id: string): Promise<T | null> {
    let pool = await this.connectionService.getConnection();
    let result = await pool
      .request()
      .input("id", id)
      .query<T>(`SELECT * FROM ${this.tableName} WHERE id = @id`);

    return result.recordset.find(() => true) as T | null;
  }

  public async insert(data: Partial<T>): Promise<void> {
    let pool = await this.connectionService.getConnection();

    let keys = Object.keys(data);
    let values = Object.values(data);

    let columns = keys.join(", ");
    let params = keys.map((_, i) => `@p${i}`).join(", ");

    let request = pool.request();
    keys.forEach((_, i) => {
      request.input(`p${i}`, values[i]);
    });

    await request.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${params})`
    );
  }

  public async update(id: string, data: Partial<T>): Promise<void> {
    let pool = await this.connectionService.getConnection();

    let keys = Object.keys(data);
    let values = Object.values(data);

    let setClause = keys.map((k, i) => `${k} = @p${i}`).join(", ");

    let request = pool.request();
    keys.forEach((_, i) => {
      request.input(`p${i}`, values[i]);
    });
    request.input("id", id);

    await request.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = @id`
    );
  }

  public async delete(id: string): Promise<void> {
    const pool = await this.connectionService.getConnection();

    await pool
      .request()
      .input("id", id)
      .query(`DELETE FROM ${this.tableName} WHERE id = @id`);
  }
}
