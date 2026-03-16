import dotenv from "dotenv";
import { Pool, PoolConfig } from "pg";

dotenv.config();

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => {
  const start = Date.now();
  return pool
    .query(text, params)
    .then((res) => {
      const duration = Date.now() - start;
      console.log("Executed query", { text, duration, rows: res.rowCount });
      return res;
    })
    .catch((err) => {
      console.error("Query error", { text, err });
      throw err;
    });
};

export const getClient = () => {
  return pool.connect();
};

export default pool;
