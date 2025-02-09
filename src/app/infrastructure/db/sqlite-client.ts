import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export class SQLite {
  private static instance: SQLite;
  private dbPath: string;
  private db!: Database;

  private constructor(dbName: string) {
    if (!dbName) {
      throw new Error("El nombre de la base de datos no puede estar vacío.");
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.dbPath = path.resolve(__dirname, `../../../data/${dbName}.sqlite`);

    // Crear la carpeta si no existe
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Método para obtener una instancia única
  public static async getInstance(dbName: string): Promise<SQLite> {
    if (!SQLite.instance) {
      SQLite.instance = new SQLite(dbName);
      await SQLite.instance.connect();
    }
    return SQLite.instance;
  }

  private async connect() {
    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database,
    });
  }

  public getDatabase(): Database {
    if (!this.db) {
      throw new Error("La base de datos no está inicializada.");
    }
    return this.db;
  }

  public async close() {
    if (this.db) {
      await this.db.close();
      console.log("📂 Conexión cerrada.");
    }
  }
}
