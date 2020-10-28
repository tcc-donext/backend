import env from 'dotenv';

env.config();

export default {
  client: 'pg',
  connection: process.env['DATABASE_URL'],
};