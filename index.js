import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from 'dotenv';

env.config();

const app = express();

// Middlewares de segurança (se tiver problema de CORS, comente a segunda linha abaixo)
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  return res.json({ index: 'test' });
});

app.listen(process.env.PORT);
