import { connect, ConnectionPool } from "mssql";
import { Service } from "squirrel-lib";

@Service()
export class ConnectionPoolService {
  private pool?: ConnectionPool;

  public async getConnection(): Promise<ConnectionPool> {
    if (this.pool) return this.pool;

    return (this.pool = await connect(process.env.DB_CONNECTION_STRING!));
  }
}
