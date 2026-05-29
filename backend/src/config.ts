import dotenv from 'dotenv';

dotenv.config();

function readNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  port: readNumber(process.env.PORT, 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  database: {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: readNumber(process.env.MYSQL_PORT, 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? 'password',
    database: process.env.MYSQL_DATABASE ?? 'devops_fullstack'
  }
};