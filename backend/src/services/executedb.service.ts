import db from "../utils/db/db.util";
import exceptions from "../exceptions/db.exceptions";

interface out {
  status: number;
  data: any;
}

async function executedb(filename: string, params: any = null, filters: any = null): Promise<out> {
  let conn;

  try {
    conn = await db.getConnection();
    if (!conn) throw exceptions.NoConnectionToDB;

    const query = await db.readFile(filename);
    const result = await db.executeQuery(conn, query, params, filters);

    if (result.length > 0) {
      return {
        status: 200,
        data: result,
      };
    } else {
      return { status: 204, data: result };
    }
  } finally {
    if (conn) {
      await db.closeConnection(conn);
    }
  }
}

export default executedb;
