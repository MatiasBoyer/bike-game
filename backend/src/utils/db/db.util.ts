import mariadb, { Pool, PoolConnection } from "mariadb";
import cf_db from "../../config/db.config";
import * as path from "node:path";
import fs from "node:fs";

let pool: Pool | undefined;

async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = mariadb.createPool(cf_db);
  }
  return pool;
}

async function getConnection(): Promise<PoolConnection> {
  const p = await getPool();
  return p.getConnection();
}

async function closeConnection(pool: PoolConnection) {
  await pool.release();
}

async function readFile(filepath: string): Promise<string> {
  const fullPath = path.join(__dirname, "..", "..", "db", filepath);
  const data = await fs.promises.readFile(fullPath, "utf-8");
  return data;
}

function namedParams(
  query: string,
  params: Record<string, any>,
  searchFor: string = ":"
) {
  const values: any[] = [];
  const regex = new RegExp(`${searchFor}(\\w+)`, "g");
  const sql = query.replace(regex, (_, key) => {
    if (!(key in params)) throw new Error(`Missing param: ${key}`);
    values.push(params[key]);
    return "?";
  });
  return { sql, values };
}

async function executeQuery(
  conn: PoolConnection,
  query: string,
  params: Record<string, any> | undefined = undefined,
  filters: Record<string, any> | undefined = undefined
) {
  let sql = query;
  let values: any[] | undefined = undefined;

  if (params) {
    let res = namedParams(query, params, ":");
    sql = res.sql;
    values = res.values;
  }

  if (filters) {
    let res = namedParams(query, filters, "-- %");
    sql = res.sql;
    values = res.values;
  }

  return await conn.execute(sql, values);
}

export default {
  getConnection,
  closeConnection,
  readFile,
  executeQuery,
};
