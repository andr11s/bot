import { SQLiteService } from "@/src/app/infrastructure/db/sqlite-service";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/users.models";

export class UserService extends SQLiteService {
  constructor(dbName: string) {
    super(dbName);
  }

  async createUserTable() {
    await this.createTable(
      "users",
      `
      id TEXT PRIMARY KEY,      -- UUID para identificar cada usuario
      channelId TEXT NOT NULL,  -- ID único del canal de streaming
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,  -- Fecha de registro del usuario
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP   -- Última actualización de datos
    `,
    );
  }

  async addUser(channelId: string) {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    return await this.insert("users", {
      id,
      channelId,
      createdAt,
      updatedAt,
    });
  }

  async getUsers(): Promise<User[]> {
    return await this.getAll("users");
  }

  async getUserById(id: number): Promise<User> {
    return await this.getById("users", id);
  }

  async getByDynamicQuery(
    column: string,
    value: string | number,
  ): Promise<User | null> {
    return await this.getByDynamiColumnAndValue("users", column, value);
  }

  async updateUser(id: number, channelId: string) {
    return await this.update("users", id, { channelId });
  }

  async deleteUser(id: number | string) {
    try {
      return await this.delete("users", id);
    } catch (error) {
      console.log("error al eliminar el id", id);
    }
  }
}
