import { SQLiteService } from "@/src/app/infrastructure/db/sqlite-service";
import { v4 as uuidv4 } from "uuid";
import { Groups } from "../models/groups.models";

export class GroupsService extends SQLiteService {
  private dbNameBd!: string;

  constructor(dbName: string) {
    super(dbName);
    this.dbNameBd = dbName;
  }

  async createGroupsTable() {
    try {
      await this.createTable(
        this.dbNameBd,
        `
        id TEXT PRIMARY KEY,      -- UUID para identificar cada usuario
        channelId TEXT NOT NULL,  -- ID único del canal de streaming
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,  -- Fecha de registro del usuario
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP   -- Última actualización de datos
      `,
      );
    } catch (error) {
      console.log("error al crear la bd de grupos", error);
    }
  }

  async addGroup(channelId: number) {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    return await this.insert(this.dbNameBd, {
      id,
      channelId,
      createdAt,
      updatedAt,
    });
  }

  async getGroups(): Promise<Groups[]> {
    return await this.getAll(this.dbNameBd);
  }

  async getGroupById(id: number): Promise<Groups> {
    return await this.getById(this.dbNameBd, id);
  }

  async getByDynamicQuery(
    column: string,
    value: string | number,
  ): Promise<Groups | null> {
    return await this.getByDynamiColumnAndValue(this.dbNameBd, column, value);
  }

  async updateGroup(id: number, channelId: string) {
    return await this.update(this.dbNameBd, id, { channelId });
  }

  async deleteGroup(id: number | string) {
    try {
      return await this.delete(this.dbNameBd, id);
    } catch (error) {
      console.log("error al eliminar el id", id);
    }
  }
}
