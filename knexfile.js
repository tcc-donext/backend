import path from 'path';
import env from 'dotenv';

env.config();
const __dirname = path.resolve(path.dirname('')); //somente __dirname em path.resolve não estava funcionando

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
    //rodar seeds: npx knex --knexfile knexfile.js seed:run --esm
  },
};
