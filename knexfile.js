import path from 'path';
import env from 'dotenv';

env.config();

export default {
  client: 'pg',
  // connection: process.env['DATABASE_URL'],
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DBNAME,
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
  },
};
