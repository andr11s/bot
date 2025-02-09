import { Database } from "sqlite";
import { SQLite } from "./sqlite-client";

export class SQLiteService {
  private db!: Database;

  private static instances: { [key: string]: SQLiteService } = {};

  constructor(private dbName: string) {}

  async init() {
    const sqliteInstance = await SQLite.getInstance(this.dbName);
    this.db = sqliteInstance.getDatabase();
    console.log(`Base de datos ${this.dbName} inicializada.`);
  }

  private async ensureDbInitialized() {
    if (!this.db) throw new Error("La base de datos no está inicializada.");
  }

  /** 📌 Método genérico para crear tablas */
  async createTable(tableName: string, schema: string) {
    await this.ensureDbInitialized();
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`;
    await this.db.exec(query);
    console.log(`✔️ Tabla '${tableName}' creada o ya existe.`);
  }

  /** 📌 Método genérico para insertar datos en una tabla */
  async insert(tableName: string, data: Record<string, any>) {
    await this.ensureDbInitialized();
    const keys = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map(() => "?").join(", ");
    const query = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;
    const stmt = await this.db.prepare(query);
    const result = await stmt.run(...values);
    return result.lastID;
  }

  /** 📌 Método genérico para obtener datos */
  async getAll(tableName: string) {
    await this.ensureDbInitialized();
    return await this.db.all(`SELECT * FROM ${tableName}`);
  }

  /** 📌 Método genérico para obtener un solo registro */
  async getById(tableName: string, id: number) {
    await this.ensureDbInitialized();
    return await this.db.get(`SELECT * FROM ${tableName} WHERE id = ?`, id);
  }

  async getByDynamiColumnAndValue(
    tableName: string,
    column: string,
    value: string | number,
  ) {
    await this.ensureDbInitialized();
    const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

    return await this.db.get(query, value);
  }

  /** 📌 Método genérico para actualizar registros */
  async update(tableName: string, id: number, data: Record<string, any>) {
    await this.ensureDbInitialized();
    const updates = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);
    values.push(id);
    const query = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;
    const stmt = await this.db.prepare(query);
    return await stmt.run(...values);
  }

  /** 📌 Método genérico para eliminar registros */
  async delete(tableName: string, id: number | string) {
    await this.ensureDbInitialized();
    return await this.db.run(`DELETE FROM ${tableName} WHERE id = ?`, id);
  }
}
